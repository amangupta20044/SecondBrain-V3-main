import {
  FileText,
  Link as LinkIcon,
  Trash2,
  Twitter,
  Youtube,
  FileImage,
  ArrowUpRight,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import axios from "axios";
import { ApiRoutes } from "../utils/routeApi";
import { useState } from "react";
import { CreateCardType } from "./type/Types";
import { YouTubeComp } from "./YoutubeComp";
import { TwitterComp } from "./TweetComp";
import ShinyButton from "./ui/shiny-button";
import { useDispatch } from "react-redux";
import { setOpen, setSummary } from "@/store/slice/contenSlice";

type Type = {
  _id: string;
  title: string;
};

type CardProp = {
  _id: string;
  link: string;
  title: string;
  description?: string;
  date: string;
  tags?: Type[];
  type: string;
};

const iconMap: { [key: string]: React.ElementType } = {
  tweet: Twitter,
  video: Youtube,
  link: LinkIcon,
  "article ": FileText,
  article: FileText,
  image: FileImage,
};

const typeLabelMap: { [key: string]: string } = {
  tweet: "Tweet",
  video: "Video",
  link: "Link",
  "article ": "Article",
  article: "Article",
  image: "Image",
};

export default function CardComponent({
  cardData,
  setCardData,
  selectedType,
}: {
  cardData: CardProp[];
  setCardData: React.Dispatch<React.SetStateAction<CardProp[]>>;
  selectedType: CreateCardType;
}) {
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;
  const userId = userData ? userData.id : null;
  const [loading, setLoading] = useState(false);
  const [deleteCardInx, setDeleteCardInx] = useState<number>();

  const removeThought = async (id: string, index: number) => {
    setLoading(true);
    setDeleteCardInx(index);
    const deleteContent = {
      contentId: id,
      userId,
    };
    try {
      const response = await axios.delete(ApiRoutes.remove, {
        data: deleteContent,
      });

      if (response.status === 200 || response.statusText === "OK") {
        setCardData((prevCardData) =>
          prevCardData.filter((item) => item._id !== id)
        );
      } else {
        console.log("Error deleting content");
      }
    } catch (error) {
      console.log("Error:", error);
    }
    setLoading(false);
  };

  const isYoutubeVid = (thoughtLink: string): boolean => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(thoughtLink)) {
      return false;
    }
    const videoId = getYouTubeVideoId(thoughtLink);
    return !!videoId;
  };

  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const isTweet = (thoughtLink: string): boolean => {
    const twitterRegExp =
      /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
    const xRegExp = /^https?:\/\/x\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
    return twitterRegExp.test(thoughtLink) || xRegExp.test(thoughtLink);
  };

  const refineTweetUrl = (url: string) => {
    const xComPattern = /^https?:\/\/(www\.)?x\.com/;
    if (xComPattern.test(url)) {
      return url.replace(xComPattern, "https://twitter.com");
    }
    return url;
  };

  const dispatch = useDispatch();
  const handleYoutubeSummary = async (link: string) => {
    try {
      const res = await axios.post(ApiRoutes.summary, { url: link });
      const data = res.data;
      dispatch(setSummary(data.data));
      dispatch(setOpen(true));
    } catch (error) {
      console.log(error);
    }
  };

  const cleanTitle = (rawTitle: string): string => {
    if (!rawTitle) return "Saved Content";
    let cleaned = rawTitle.replace(/^Bookmark:\s*/i, "").trim();
    cleaned = cleaned.replace(/^#Video\s*\|\s*/i, "").trim();
    return cleaned || rawTitle;
  };

  const getDomainName = (url: string): string => {
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, "");
    } catch (e) {
      return "web";
    }
  };

  const filterCards = cardData.filter(
    (item) => !selectedType || item.type === selectedType
  );

  if (filterCards.length === 0) {
    return (
      <div className="w-full py-16 text-center text-neutral-400">
        <p className="text-base font-medium">No contents found in this category.</p>
        <p className="text-xs text-neutral-500 mt-1">Save new pages using the extension or import button above.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start w-full">
        {cardData
          .slice()
          .reverse()
          .map((data, index) => {
            if (selectedType && data.type !== selectedType) return null;

            const IconComponent = iconMap[data.type] || FileText;
            const typeLabel = typeLabelMap[data.type] || "Content";
            const date = new Date(data.date);
            const formattedTitle = cleanTitle(data.title);
            const domain = getDomainName(data.link);

            // Determine if description is distinct or redundant
            const showDescription =
              data.description &&
              data.description.trim() !== "" &&
              data.description.trim() !== data.title.trim() &&
              !data.description.startsWith("Saved web link") &&
              data.description.trim() !== formattedTitle;

            if (loading && deleteCardInx === index) {
              return (
                <div
                  key={data._id || index}
                  className="w-full h-48 rounded-2xl animate-pulse bg-neutral-800/40 border border-white/5"
                />
              );
            }

            return (
              <div key={data._id || index} className="w-full">
                <Card className="shadow-lg bg-[#1e1e20] hover:bg-[#252528] border border-white/10 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-purple-500/10 hover:-translate-y-0.5 flex flex-col justify-between">
                  <CardHeader className="p-4 pb-3 space-y-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        <IconComponent className="h-3.5 w-3.5 text-purple-400" />
                        <span>{typeLabel}</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <a
                          href={data.link}
                          target="_blank"
                          rel="noreferrer"
                          title="Open original link"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-neutral-400 hover:text-white hover:bg-neutral-700/50 rounded-lg"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                          onClick={() => removeThought(data._id, index)}
                          title="Delete content"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-100 text-sm leading-snug line-clamp-2">
                      {formattedTitle}
                    </h3>
                  </CardHeader>

                  <CardContent className="px-4 pb-4 pt-0 space-y-3">
                    <Separator className="bg-neutral-800" />

                    {showDescription && (
                      <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                        {data.description}
                      </p>
                    )}

                    {/* Embedded Media Previews */}
                    <div>
                      {isYoutubeVid(data.link) && (
                        <div className="w-full rounded-xl overflow-hidden shadow-inner border border-white/5">
                          <YouTubeComp url={data.link} />
                        </div>
                      )}

                      {isTweet(data.link) && (
                        <div className="w-full rounded-xl overflow-hidden">
                          <TwitterComp tweetUrl={refineTweetUrl(data.link)} />
                        </div>
                      )}

                      {!isYoutubeVid(data.link) && !isTweet(data.link) && (
                        <div className="w-full p-3 rounded-xl bg-neutral-900/60 border border-neutral-700/50 flex items-center justify-between space-x-2 group">
                          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                            <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                              <Globe className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-200 truncate">
                                {domain}
                              </p>
                              <p className="text-[11px] text-neutral-400 truncate">
                                {data.link}
                              </p>
                            </div>
                          </div>
                          <a
                            href={data.link}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-medium text-[11px] rounded-lg flex-shrink-0 transition shadow-sm"
                          >
                            Visit &rarr;
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Tag Pills */}
                    {data.tags && data.tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap pt-1">
                        {data.tags.map((tag, idx) => (
                          <span
                            className="text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md text-[11px] font-medium"
                            key={tag._id || idx}
                          >
                            #{tag.title}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Date & AI Summary */}
                    <div className="flex justify-between items-center pt-2 text-xs text-neutral-400">
                      <span>Added on {date.toLocaleDateString()}</span>
                      {isYoutubeVid(data.link) && (
                        <ShinyButton onClick={() => handleYoutubeSummary(data.link)}>
                          Summary
                        </ShinyButton>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
      </div>
    </div>
  );
}
