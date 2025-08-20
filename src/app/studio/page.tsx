"use client"
import { useRevealer } from '@/hooks/useRevealer'
const Studio = () => {
    useRevealer()
 return (
    <>
    <div className="revealer"></div>

        <div className="studio">
            <div className="col">
                <h2>Our Story</h2>
            </div>
            <div className="col">
                <h2>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iure ut, soluta assumenda magni facilis, dolor voluptatum dicta non deserunt molestiae, eius aperiam recusandae totam aut ratione ad earum sunt ducimus.</h2>
            </div>
        </div>
    </>
 )
}

export default Studio;