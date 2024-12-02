export const ParsePDFName = (filename: string | undefined): string => {
    let title = "Unknow"
    
    if (filename) {
        const cleanPDFName = filename.split(".pdf")
        title = cleanPDFName[0]
    }
    
    return title 
}