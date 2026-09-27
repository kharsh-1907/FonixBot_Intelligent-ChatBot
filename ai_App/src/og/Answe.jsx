import { useEffect, useState } from "react"
import { checkHeading, replaceHeadingStar, checkLabel } from "./helper"

// this is used for making ans. in good format here args.: ans= string(answer) from ai;index= item(q).
const Answer = ({ ans,index,totalresult }) => {
    const [heading, setHeading] = useState(false)
    const [label, setLabel] = useState(false)
    const [ANSWER,setANSWER] = useState(ans)

    // /the chechHeading&replacing are from .helper used to simplify ai's answer(ans is given as arg.)
// checks the answer and changes it according to its format
    useEffect(() => {
        const text = ans.trim()
        if (checkHeading(text)) {
            setHeading(true)
            setLabel(false)
            setANSWER(replaceHeadingStar(text))
        } else if (checkLabel(text)) {
            setLabel(true)
            setHeading(false)
            setANSWER(text.replace(":", ""))
        } else {
            setLabel(false)
            setHeading(false)
            setANSWER(text)
        }
    },[ans])

    if (!ANSWER) return null

    return (
        <>
            {
                index === 0 && totalresult > 1 ? <span className="text-xl block mb-5 leading-8 font-medium">{ANSWER}</span>
                : heading ? <h2 className="pt-5 pb-2 text-xl sm:text-2xl block font-semibold tracking-wide">{ANSWER}</h2>
                : label ? <h3 className="pt-3 pb-1 text-base sm:text-lg block font-semibold">{ANSWER}</h3>
                : <p className="pl-2 text-md sm:text-lg block mb-3 leading-8 opacity-90">{ANSWER}</p>
            }
        </>
    )
}

export default Answer