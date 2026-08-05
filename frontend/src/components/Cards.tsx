// import { allPosts } from "@/.contentlayer/generated";
import { PostCard } from './ui/card-binary-view'
import { Separator } from './ui/separator'
import { TextGenerateEffect } from './ui/text-gen'
import { cards } from "../data/data";


const Cards = () => {
  
  return (
    <div className='flex flex-col gap-5 justify-center items-center container max-w-4xl py-6 lg:py-10 mt-24'>
      <h1 className='relative z-10 text-2xl md:text-7xl font-headingAlt  bg-clip-text text-transparent bg-gradient-to-b from-purple-300/90 to-white/90  text-center font-bold'>
        <TextGenerateEffect
          words="A Knowledgebase made for you"
          className=' text-3xl md:text-6xl font-headingAlt  bg-clip-text text-transparent bg-gradient-to-b from-purple-300/90 to-white/90  text-center '
        />
      </h1>
      <Separator />
      <div className='flex items-center justify-center text-center'>
      <p>Secondbrain offers all the vital building blocks you need to transform your gold mine of content into a powerful knowledgebase for yourself, your team or even a group of friends!</p>
      </div>

      <div className='relative flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-8 mt-24'>
        {/* <hr className='my-8' /> */}
        {cards?.length ? (
          <div className='grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
            {cards.map((post, index) => (
              <PostCard
                key={index}
                title={post.title}
                description={post.description!}
                icon={post.icon}
              />

            ))}
            <div className='absolute -top-4 -z-10 flex w-full justify-center'>
              <div className='h-[310px] w-[310px] max-w-full animate-pulse-slow rounded-full bg-[#8678F9] opacity-20 blur-[100px]' />
            </div>
            <div className='absolute -top-4 -z-10 flex w-full justify-center'>
              <div className='h-[310px] w-[310px] max-w-full animate-pulse-slow rounded-full bg-[#8678F9] opacity-20 blur-[100px]' />
            </div>
          </div>
        ) : (
          <p>No posts published.</p>
        )}
      </div>
      <div>
        
      </div>
    </div>
  )
}

export default Cards