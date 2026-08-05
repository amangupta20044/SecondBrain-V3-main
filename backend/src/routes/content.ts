import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { ContentModel } from "../db/db";
import run from "../ai/youtube";
import { generateEmbeddings } from "../ai/getEmbeddings";
const contentRouter = Router()

contentRouter.get("/test", (req: Request, res: Response) => {
    res.json({
        message: "testing /content/test route"
    })
})

contentRouter.post("/create", async (req: Request, res: Response) => {
    try {
        const { link, type, title, description, tags, userId } = req.body
        
        if (!link || !type || !title || !userId) {
            res.status(400).json({
                message: "Please enter all required details (link, type, title, userId)"
            })
            return
        }

        const safeDescription = description || title || "";
        const safeTags = Array.isArray(tags) ? tags : [];

        let embeddings: number[] = [];
        try {
            const searchableText = `${title} ${safeDescription}`.trim();
            if (searchableText && process.env.OPENAI_API_KEY) {
                embeddings = await generateEmbeddings(searchableText);
            }
        } catch (embErr) {
            console.warn("Embedding generation failed, saving content without vector embedding:", embErr);
            embeddings = [];
        }

        const newContent = await ContentModel.create({
            link,
            type,
            title,
            description: safeDescription,
            date: Date.now(),
            tags: safeTags,
            userId,
            embeddings
        })

        res.status(201).json({
            message: "Content created",
            content: newContent
        })
    } catch (error) {
        console.error("Error creating content:", error);
        res.status(500).json({
            message: "Error something went wrong",
            error: error instanceof Error ? error.message : String(error)
        });
    }
})

contentRouter.post("/search" , async(req: Request , res:Response)=>{
    {
        try {
            const {query} = req.body

           if(!query) return
            console.log(query)
           const queryEmbedding = await generateEmbeddings(query)
           console.log(queryEmbedding)

           const results = await ContentModel.aggregate([
            {
                $vectorSearch: {
                    queryVector: queryEmbedding,
                    path: "embeddings",
                    numCandidates: 100,
                    limit: 2,
                    index: "vector_index"
                }
            }
        ]);
           console.log(results)
           res.status(200).json(results)
        } catch (error) {
            res.status(500).json({message:"Search Failed"})
        }
    }
})

contentRouter.post("/summarize" , async (req: Request, res: Response): Promise<void> => {
    try {
        const { url} = req.body;
        console.log(url)
        if(!url){
            res.status(400).json({
                message: "Youtube URL is required"
            })
            return
        }
        
        const data = await run(url)
        console.log(data)
        if(!data) {
            res.status(400).json({
                message:" No Transcript "
            })
            return
        }
        res.status(201).json({
            data: data
        })
    } catch (error) {
        res.status(500).json({ message : error });
    }
} )

contentRouter.delete("/remove", async (req: Request, res: Response): Promise<void> => {
    try {
        const { contentId, userId } = req.body;

        if (!contentId || !userId) {
            res.status(400).json({
                message: "Content ID and User ID are required"

            })
            return
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            res.status(400).json({
                message: "Invalid Content id"
            })
            return
        }
        const content = await ContentModel.findById(contentId)
        if (!content) {
            res.status(404).json({
                message: "Content not found"
            })
            return
        }
        if (content.userId && content.userId.toString() !== userId) {
            res.status(403).json({
                message: "You are not authorized to delete this content"
            })
        }

        await ContentModel.findByIdAndDelete(contentId)

        res.status(200).json({
            message:"Content deleted successfully"
        })
        return
    } catch (error) {
        console.error("Error deleting content : " , error)
        res.status(500).json({
            message:"Internal server error"
        })
        return;
    }
})

export default contentRouter