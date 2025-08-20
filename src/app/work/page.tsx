"use client"
import { useRevealer } from '@/hooks/useRevealer'

const Work = () => {
    useRevealer()

return (
    <>
    <div className="revealer"></div>

        <div className="work">
           <h1>Selected Work</h1> 
        
        <div className="projects">
            <video autoPlay loop muted className="project-video" src={"/video.mp4"}></video>
        </div>
        </div>
    </>
)

}

export default Work