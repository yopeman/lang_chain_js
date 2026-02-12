import splitAndExtract from "./split_and_extract_pdf.js";

let extract_toc = (extracted_pages) => {
    let starting_page = 0
    let ending_page = 0

    for (const page of extracted_pages) {
        let toc_regex = /Table of Contents?/i
        let unit_regex = /(Unit|Chapter|Section)[\s\S]{0,10}(One|1)/i

        let test_toc_result = toc_regex.test(page.content)
        if (starting_page == 0 && test_toc_result) {
            console.log(test_toc_result, 'test_toc_result', page.physicalPage)
            starting_page = page.physicalPage
        }

        let test_unit_result = unit_regex.test(page.content)
        if (starting_page != page.physicalPage && test_unit_result) {
            console.log(test_unit_result, 'test_unit_result', page.physicalPage)
            ending_page = page.physicalPage
            break
        }
    }

    let toc_text = ''
    for (let i = starting_page; i < ending_page; i++) {
        toc_text += extracted_pages[i-1].content
    }
    return toc_text.trim()
}

let extracted_pdf = await splitAndExtract('../docs/G9-Biology-STB-2023-web.pdf')
let toc = extract_toc(extracted_pdf)

console.log(toc);
