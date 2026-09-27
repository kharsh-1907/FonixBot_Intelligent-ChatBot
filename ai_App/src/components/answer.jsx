import {useEffect,useState} from "react"

// this is used for making ans. in good format here args.: ans= string(answer) from ai;index= item(q).
const Answer=({ans,index,totalresult})=>{
const[formattedAnswer,setFormattedAnswer]=useState([])

// /the formatting below is used to simplify ai's answer(ans is given as arg.)

// checks the answer and changes it according to its format
useEffect(()=>{
if(!ans){setFormattedAnswer([]);return}
const lines=String(ans).trim().split(/\r?\n/).map(line=>line.trim()).filter(line=>line!=="")
const formatted=lines.map(line=>{
if(/^\d+\.\s+/.test(line)){
const match=line.match(/^(\d+)\.\s+(.*)$/)
return{type:"number",number:match[1],text:match[2]}
}
if(/^#{1,3}\s+/.test(line))return{type:"heading",text:line.replace(/^#{1,3}\s+/,"")}
if(/^\*\*(.*?)\*\*$/.test(line))return{type:"heading",text:line.replace(/^\*\*(.*?)\*\*$/,"$1")}
if(/^(Answer|Explanation|Conclusion|Note|Example|Examples|Summary|Key Points|Contribution|Field):$/i.test(line))return{type:"label",text:line.replace(":","")}
if(/^[-*•]\s+/.test(line))return{type:"bullet",text:line.replace(/^[-*•]\s+/,"")}
return{type:"paragraph",text:line}
})
setFormattedAnswer(formatted)
},[ans])

if(!formattedAnswer.length)return null

return(
<div className="w-full">
{formattedAnswer.map((item,i)=>{
// numbered item
if(item.type==="number")return(
<div key={i} className="flex gap-3 mt-6 mb-2">
<span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white text-sm font-semibold">{item.number}</span>
<p className="text-lg sm:text-xl font-semibold leading-8">{formatBold(item.text)}</p>
</div>
)

// heading
if(item.type==="heading")return <h2 key={i} className="mt-6 mb-3 text-xl sm:text-2xl font-semibold tracking-wide">{formatBold(item.text)}</h2>

// label
if(item.type==="label")return <h3 key={i} className="mt-5 mb-2 text-base sm:text-lg font-semibold opacity-90">{item.text}</h3>

// bullet point
if(item.type==="bullet")return(
<div key={i} className="flex gap-3 ml-2 mb-2">
<span className="mt-3 w-2 h-2 rounded-full bg-current shrink-0"/>
<p className="text-base sm:text-lg leading-8 opacity-90">{formatBold(item.text)}</p>
</div>
)

// normal paragraph
return(
<p key={i} className={i===0&&index===0&&totalresult>1?"mb-5 text-lg sm:text-xl leading-8":"mb-3 text-base sm:text-lg leading-8 opacity-90"}>{formatBold(item.text)}</p>
)
})}
</div>
)
}

// converts **text** into bold text
function formatBold(text){
const parts=text.split(/(\*\*.*?\*\*)/g)
return parts.map((part,index)=>/^\*\*.*\*\*$/.test(part)?<strong key={index}>{part.replace(/^\*\*|\*\*$/g,"")}</strong>:part)
}

export default Answer