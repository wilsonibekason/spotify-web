import * as React from "react"
import {Metadata} from "next";

interface  MetaDataWrapperProps{
    children: React.ReactNode
}

const metadata: Metadata ={
    title:"",
    description:""
}
const MetaDataWrapper: React.FC<MetaDataWrapperProps> = ({children}) => {
    return (
        <>
            <html>
            <body>
            {children}
            </body>
            </html>
        </>
    )
}


export default  MetaDataWrapper