from __future__ import annotations

from pathlib import Path
from datetime import date

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


OUT = Path(__file__).resolve().parent / "Lior-Noy-Website-Project-Handoff-HE.docx"

# compact_reference_guide preset, with two named overrides:
# 1) SitePaletteCover: warm editorial colors from the prototype on the cover.
# 2) RTLHebrew: right-aligned Hebrew body while keeping preset size/rhythm.
INK = "11110F"
GRAY = "73736F"
BLUE = "2E74B5"
DARK_BLUE = "1F4D78"
LIGHT_BLUE = "E8EEF5"
LIGHT_GRAY = "F2F4F7"
WARM = "F4F0E9"
TAUPE = "AE9A87"
WHITE = "FFFFFF"
AMBER = "9F806C"
GREEN = "96A184"
RED = "9B1C1C"


def set_cell_shading(cell, fill: str):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=80, start=120, bottom=80, end=120):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for key, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{key}"))
        if node is None:
            node = OxmlElement(f"w:{key}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_cell_border(cell, **edges):
    tc_pr = cell._tc.get_or_add_tcPr()
    borders = tc_pr.first_child_found_in("w:tcBorders")
    if borders is None:
        borders = OxmlElement("w:tcBorders")
        tc_pr.append(borders)
    for edge, spec in edges.items():
        tag = f"w:{edge}"
        el = borders.find(qn(tag))
        if el is None:
            el = OxmlElement(tag)
            borders.append(el)
        for key, value in spec.items():
            el.set(qn(f"w:{key}"), str(value))


def set_table_geometry(table, widths_dxa: list[int], indent=120):
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    table.autofit = False
    tbl_pr = table._tbl.tblPr
    tbl_w = tbl_pr.first_child_found_in("w:tblW")
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(sum(widths_dxa)))
    tbl_w.set(qn("w:type"), "dxa")
    tbl_ind = tbl_pr.first_child_found_in("w:tblInd")
    if tbl_ind is None:
        tbl_ind = OxmlElement("w:tblInd")
        tbl_pr.append(tbl_ind)
    tbl_ind.set(qn("w:w"), str(indent))
    tbl_ind.set(qn("w:type"), "dxa")
    grid = table._tbl.tblGrid
    for child in list(grid):
        grid.remove(child)
    for width in widths_dxa:
        col = OxmlElement("w:gridCol")
        col.set(qn("w:w"), str(width))
        grid.append(col)
    for row in table.rows:
        for idx, cell in enumerate(row.cells):
            cell.width = Inches(widths_dxa[idx] / 1440)
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_w = tc_pr.first_child_found_in("w:tcW")
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:w"), str(widths_dxa[idx]))
            tc_w.set(qn("w:type"), "dxa")
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER


def set_font(run, name="Calibri", size=None, color=None, bold=None, italic=None):
    run.font.name = name
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), name)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), name)
    run._element.get_or_add_rPr().rFonts.set(qn("w:cs"), "Arial")
    if size is not None:
        run.font.size = Pt(size)
    if color:
        run.font.color.rgb = RGBColor.from_string(color)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic


def set_rtl(paragraph, rtl=True):
    p_pr = paragraph._p.get_or_add_pPr()
    bidi = p_pr.find(qn("w:bidi"))
    if rtl and bidi is None:
        bidi = OxmlElement("w:bidi")
        p_pr.append(bidi)
    elif not rtl and bidi is not None:
        p_pr.remove(bidi)
    paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT if rtl else WD_ALIGN_PARAGRAPH.LEFT
    for run in paragraph.runs:
        r_pr = run._element.get_or_add_rPr()
        rtl_el = r_pr.find(qn("w:rtl"))
        if rtl and rtl_el is None:
            r_pr.append(OxmlElement("w:rtl"))


def set_keep(paragraph, next_=False):
    paragraph.paragraph_format.keep_together = True
    if next_:
        paragraph.paragraph_format.keep_with_next = True


def add_para(doc, text="", *, style=None, size=11, color=INK, bold=False, italic=False,
             after=6, before=0, align=WD_ALIGN_PARAGRAPH.RIGHT, rtl=True, keep=False):
    p = doc.add_paragraph(style=style)
    p.alignment = align
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.line_spacing = 1.25
    r = p.add_run(text)
    set_font(r, size=size, color=color, bold=bold, italic=italic)
    if rtl:
        set_rtl(p)
    if keep:
        set_keep(p)
    return p


def add_mixed_para(doc, parts, *, after=6, before=0, rtl=True, align=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.line_spacing = 1.25
    p.alignment = align or (WD_ALIGN_PARAGRAPH.RIGHT if rtl else WD_ALIGN_PARAGRAPH.LEFT)
    for text, kwargs in parts:
        r = p.add_run(text)
        set_font(r, **kwargs)
    if rtl:
        set_rtl(p)
    return p


def add_heading(doc, text, level=1, page_break=False):
    if page_break:
        doc.add_page_break()
    p = doc.add_paragraph(text, style=f"Heading {level}")
    set_rtl(p)
    set_keep(p, next_=True)
    return p


def add_kicker(doc, text, index=None):
    shown = f"{index}  /  {text}" if index else text
    return add_para(doc, shown, size=9, color=AMBER, bold=True, after=8, rtl=False,
                    align=WD_ALIGN_PARAGRAPH.LEFT, keep=True)


def add_bullet(doc, text, level=0):
    p = doc.add_paragraph(style="List Bullet" if level == 0 else "List Bullet 2")
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.25
    r = p.add_run(text)
    set_font(r, size=11, color=INK)
    set_rtl(p)
    return p


def add_number(doc, text):
    p = doc.add_paragraph(style="List Number")
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.25
    r = p.add_run(text)
    set_font(r, size=11, color=INK)
    set_rtl(p)
    return p


def add_callout(doc, label, text, fill=LIGHT_BLUE, accent=BLUE):
    table = doc.add_table(rows=1, cols=1)
    set_table_geometry(table, [9360])
    cell = table.cell(0, 0)
    set_cell_shading(cell, fill)
    set_cell_border(cell, start={"val": "single", "sz": 18, "color": accent},
                    top={"val": "nil"}, bottom={"val": "nil"}, end={"val": "nil"})
    cell.text = ""
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(label)
    set_font(r, size=9, color=accent, bold=True)
    set_rtl(p)
    p2 = cell.add_paragraph()
    p2.paragraph_format.space_after = Pt(0)
    p2.paragraph_format.line_spacing = 1.25
    r2 = p2.add_run(text)
    set_font(r2, size=11, color=INK)
    set_rtl(p2)
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_after = Pt(4)
    return table


def add_hyperlink(paragraph, text, url, color=BLUE, underline=True):
    part = paragraph.part
    r_id = part.relate_to(url, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", is_external=True)
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), r_id)
    new_run = OxmlElement("w:r")
    r_pr = OxmlElement("w:rPr")
    c = OxmlElement("w:color")
    c.set(qn("w:val"), color)
    r_pr.append(c)
    if underline:
        u = OxmlElement("w:u")
        u.set(qn("w:val"), "single")
        r_pr.append(u)
    fonts = OxmlElement("w:rFonts")
    fonts.set(qn("w:ascii"), "Calibri")
    fonts.set(qn("w:hAnsi"), "Calibri")
    fonts.set(qn("w:cs"), "Arial")
    r_pr.append(fonts)
    new_run.append(r_pr)
    text_el = OxmlElement("w:t")
    text_el.text = text
    new_run.append(text_el)
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)
    return hyperlink


def add_link_para(doc, label, url, note=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.25
    if note:
        r = p.add_run(note + " — ")
        set_font(r, size=10, color=GRAY, bold=True)
    add_hyperlink(p, label, url)
    set_rtl(p)
    return p


def add_status_row(table, row_values, fills=None, bold_first=True, rtl_cols=None):
    row = table.add_row()
    for i, value in enumerate(row_values):
        cell = row.cells[i]
        cell.text = ""
        if fills and fills[i]:
            set_cell_shading(cell, fills[i])
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(value)
        set_font(r, size=9.5, color=INK, bold=(bold_first and i == 0))
        if rtl_cols is None or i in rtl_cols:
            set_rtl(p)
        else:
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    return row


def repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def set_repeat_rows(table):
    repeat_table_header(table.rows[0])


def page_field(paragraph):
    paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r = paragraph.add_run("עמוד ")
    set_font(r, size=8, color=GRAY)
    run = paragraph.add_run()
    fld_char1 = OxmlElement("w:fldChar")
    fld_char1.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    fld_char2 = OxmlElement("w:fldChar")
    fld_char2.set(qn("w:fldCharType"), "end")
    run._r.extend([fld_char1, instr, fld_char2])


def setup_styles(doc):
    styles = doc.styles
    normal = styles["Normal"]
    normal.font.name = "Calibri"
    normal._element.rPr.rFonts.set(qn("w:ascii"), "Calibri")
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Calibri")
    normal._element.rPr.rFonts.set(qn("w:cs"), "Arial")
    normal.font.size = Pt(11)
    normal.font.color.rgb = RGBColor.from_string(INK)
    normal.paragraph_format.space_before = Pt(0)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.25

    for name, size, color, before, after in (
        ("Heading 1", 16, BLUE, 18, 10),
        ("Heading 2", 13, BLUE, 14, 7),
        ("Heading 3", 12, DARK_BLUE, 10, 5),
    ):
        style = styles[name]
        style.font.name = "Calibri"
        style._element.rPr.rFonts.set(qn("w:ascii"), "Calibri")
        style._element.rPr.rFonts.set(qn("w:hAnsi"), "Calibri")
        style._element.rPr.rFonts.set(qn("w:cs"), "Arial")
        style.font.size = Pt(size)
        style.font.color.rgb = RGBColor.from_string(color)
        style.font.bold = True
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.keep_with_next = True
        style.paragraph_format.keep_together = True

    for list_name in ("List Bullet", "List Bullet 2", "List Number"):
        st = styles[list_name]
        st.font.name = "Calibri"
        st._element.rPr.rFonts.set(qn("w:ascii"), "Calibri")
        st._element.rPr.rFonts.set(qn("w:hAnsi"), "Calibri")
        st._element.rPr.rFonts.set(qn("w:cs"), "Arial")
        st.font.size = Pt(11)
        st.paragraph_format.left_indent = Inches(0.375)
        st.paragraph_format.first_line_indent = Inches(-0.188)
        st.paragraph_format.space_after = Pt(4)
        st.paragraph_format.line_spacing = 1.25


def setup_section(section):
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(1)
    section.right_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.header_distance = Inches(0.492)
    section.footer_distance = Inches(0.492)
    section.different_first_page_header_footer = True

    header = section.header
    hp = header.paragraphs[0]
    hp.text = "LIOR NOY / WEBSITE HANDOFF                                      CREATIVE ACTION LAB"
    hp.alignment = WD_ALIGN_PARAGRAPH.LEFT
    hp.paragraph_format.space_after = Pt(0)
    for run in hp.runs:
        set_font(run, size=7.5, color=GRAY, bold=True)

    footer = section.footer
    fp = footer.paragraphs[0]
    page_field(fp)


def add_cover(doc):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(74)
    p.paragraph_format.space_after = Pt(18)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("PROJECT HANDOFF  /  2026")
    set_font(r, size=9, color=AMBER, bold=True)

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(10)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("ד״ר ליאור נוי")
    set_font(r, size=34, color=INK, bold=True)
    set_rtl(p)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(10)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("מסמך מסירה להמשך פיתוח האתר")
    set_font(r, size=19, color=DARK_BLUE)
    set_rtl(p)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(48)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("Research profile · Creative Action Lab · Ono Academic College")
    set_font(r, size=10.5, color=GRAY, italic=True)

    add_callout(
        doc,
        "מטרת המסמך",
        "לאפשר מעבר חלק לסביבת עבודה אחרת: להבין מה נבנה, מדוע הוא נראה ומתנהג כך, מה מאושר, מה עדיין פתוח, ואיך להמשיך בלי לאבד את הכיוון העיצובי או את שלמות התוכן.",
        fill=WARM,
        accent=TAUPE,
    )

    add_para(doc, "שפת העיצוב בקצרה", size=9, color=GRAY, bold=True, after=8, rtl=True)
    palette = [
        ("בית", "F4F0E9"), ("אודות", "E9EEEA"), ("מחקר", "E8EDF0"),
        ("פרויקטים", "EDF0E8"), ("מעבדה", "EEEAF0"), ("פרסומים", "F1E9E4"),
        ("קשר", "F0ECE4"), ("אפיון", "EEE9DF"),
    ]
    table = doc.add_table(rows=1, cols=8)
    set_table_geometry(table, [1170] * 8, indent=0)
    for idx, (label, fill) in enumerate(palette):
        cell = table.cell(0, idx)
        set_cell_shading(cell, fill)
        cell.text = ""
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(14)
        r = p.add_run(label)
        set_font(r, size=7, color=INK, bold=True)
        set_rtl(p)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_para(doc, "נוצר עבור המשך העבודה · 13 בספטמבר 2026", size=8.5, color=GRAY,
             after=0, before=32, align=WD_ALIGN_PARAGRAPH.CENTER, rtl=True)


def add_chapter_title(doc, index, title, subtitle=None):
    add_kicker(doc, title.upper(), index)
    add_heading(doc, title, 1)
    if subtitle:
        add_para(doc, subtitle, size=11.5, color=GRAY, after=14)


def build():
    doc = Document()
    setup_styles(doc)
    setup_section(doc.sections[0])
    core = doc.core_properties
    core.title = "מסמך מסירה - אתר ד״ר ליאור נוי"
    core.subject = "Project handoff, design system, content and technical continuation guide"
    core.author = "Project team"
    core.keywords = "Lior Noy, Creative Action Lab, website, handoff, UI, UX"

    add_cover(doc)

    # 1 — Executive status
    doc.add_page_break()
    add_chapter_title(doc, "01", "תמונת מצב", "מה קיים כרגע ומה חשוב לדעת לפני שממשיכים")
    add_callout(
        doc,
        "השורה התחתונה",
        "קיים פרוטוטייפ דו־לשוני מלא המבוסס React ו־Vite/Vinext, המתפקד כ־SPA באמצעות Hash Routing. גרסת הקוד המקומית מתקדמת יותר מהגרסה הציבורית האחרונה הידועה; פרסום העדכון האחרון נשאר ממתין לאישור מפורש.",
        fill=LIGHT_BLUE,
        accent=BLUE,
    )
    add_heading(doc, "נכסים מרכזיים", 2)
    add_bullet(doc, "תיקיית הפרויקט: C:\\Users\\Afik\\OneDrive - OAC - Ono Academic College\\שולחן העבודה\\TwoMinds\\lior-noy-prototype")
    add_bullet(doc, "כתובת ציבורית: https://lior-noy-creative-interactions.afik-yermi.chatgpt.site/")
    add_bullet(doc, "Commit מקומי אחרון: 1f06564 — Complete lab member placeholders from planning source")
    add_bullet(doc, "מזהה פרויקט Hosting: appgprj_6a72f7e8f39c81918355029ae52f1505")
    add_bullet(doc, "עמוד האפיון נשמר ללא שינוי במסגרת סבב עדכון התוכן האחרון.")

    add_heading(doc, "סטטוס מסירה", 2)
    table = doc.add_table(rows=1, cols=3)
    headers = ["רכיב", "מצב", "משמעות להמשך"]
    for i, h in enumerate(headers):
        cell = table.rows[0].cells[i]
        set_cell_shading(cell, LIGHT_BLUE)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(h)
        set_font(r, size=9, color=DARK_BLUE, bold=True)
        set_rtl(p)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    set_table_geometry(table, [1800, 1600, 5960])
    set_repeat_rows(table)
    add_status_row(table, ["קוד מקומי", "מעודכן", "זהו מקור האמת להמשך הפיתוח."])
    add_status_row(table, ["אתר ציבורי", "דורש אימות", "לפי מצב העבודה המתועד, העדכון האחרון נשמר אך לא פורסם ללא אישור."])
    add_status_row(table, ["מצב אפיון", "פעיל", "מערכת איסוף תשובות עצמאית; אין לשכתב אותה בלי דרישה מפורשת."])
    add_status_row(table, ["תוכן", "מבוסס מקורות", "המידע באתר צומצם למקורות שאושרו בלבד."])
    add_status_row(table, ["מדיה", "חלקי", "התמונה הקיימת היא נכס פרוטוטייפ; יש להחליף בחומרים מאושרים מרומיין."])

    # 2 — Product intent and content
    doc.add_page_break()
    add_chapter_title(doc, "02", "כוונת המוצר והסיפור", "אתר תדמית אקדמי שמציג אדם, מחקר, מעבדה וקשרים — בלי להרגיש כמו עמוד קורות חיים")
    add_heading(doc, "הבטחת המותג", 2)
    add_para(doc, "האתר ממקם את ד״ר ליאור נוי כחוקר של פעולה יצירתית משותפת — בנקודת המפגש בין מדעי הקוגניציה, מדעי המחשב, תנועה, אימפרוביזציה ואינטראקציית אדם–סוכן.")
    add_heading(doc, "הרעיון המארגן", 2)
    add_callout(doc, "CREATIVE JOINT ACTION", "אנשים — ולעיתים גם סוכנים חכמים — אינם רק מגיבים זה לזה; הם מגלים דפוסים חדשים ויוצרים יחד. זהו החוט שמחבר בין Mirror Game, Creative Foraging, סיפור משותף, תנועה איטית ומודלים של יצירתיות.", fill=WARM, accent=TAUPE)
    add_heading(doc, "עקרונות תוכן", 2)
    add_number(doc, "להוביל בשאלה מחקרית אנושית וברורה, ורק אחר כך לפרט מתודולוגיה ורזומה.")
    add_number(doc, "לשמור על טון מדויק, סקרן ולא־שיווקי; סמכות נבנית ממחקר, ניסויים ושיתופי פעולה.")
    add_number(doc, "להציג עברית ואנגלית באותה מערכת, תוך התאמת כיוון ויישור — לא רק תרגום טקסט.")
    add_number(doc, "להעדיף פרויקטים ותופעות מוחשיות על פני רשימות ארוכות של הישגים.")
    add_number(doc, "לסמן מידע חסר כ־Material pending ולא להמציא פרטים, קישורים, תפקידים או דרכי קשר.")

    add_heading(doc, "עובדות מובילות שהוטמעו", 2)
    add_bullet(doc, "מרצה בכיר בקריה האקדמית אונו ומוביל את Creative Action Lab.")
    add_bullet(doc, "עד לאחרונה עמד בראש תוכנית מדעי המחשב — ניסוח זה מחייב אימות לפני אתר סופי.")
    add_bullet(doc, "דוקטורט במדעי המחשב ממכון ויצמן ופוסט־דוקטורט ב־Harvard Medical School.")
    add_bullet(doc, "ניסיון של כ־20 שנה כמבצע ומורה ב־Playback Theatre.")
    add_bullet(doc, "תחומי ליבה: creative joint action, exploration & discovery, human-agent co-creativity.")

    # 3 — IA
    doc.add_page_break()
    add_chapter_title(doc, "03", "ארכיטקטורת מידע וניווט", "אתר אחד, מעטפת אחת, שמונה מצבי תוכן המוחלפים בצד הלקוח")
    add_heading(doc, "מודל הניווט", 2)
    add_para(doc, "אין קבצי עמוד נפרדים ואין טעינה מחדש. כל לחיצה משנה את ה־hash בכתובת, מעדכנת את ה־state של React ומחליפה את אזור התוכן המרכזי. כך נשמרות מהירות, היסטוריית אחורה/קדימה ומצב טופס האפיון.")
    table = doc.add_table(rows=1, cols=3)
    for i, h in enumerate(["Route", "עמוד", "תפקיד"]):
        cell = table.rows[0].cells[i]
        set_cell_shading(cell, LIGHT_BLUE)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        set_font(r, size=9, color=DARK_BLUE, bold=True)
        if i > 0:
            set_rtl(p)
    set_table_geometry(table, [1900, 1600, 5860])
    set_repeat_rows(table)
    routes = [
        ("#/", "ראשי", "זהות, פורטרט, הבטחה מרכזית וכניסה למחקר."),
        ("#/about", "אודות", "ביוגרפיה, גישה מחקרית, ערכים וציר זמן אקדמי."),
        ("#/research", "מחקר", "שלושה כיווני מחקר בממשק טאבים אינטראקטיבי."),
        ("#/projects", "פרויקטים", "שישה model systems המציגים את העבודה בפעולה."),
        ("#/lab", "מעבדה", "סטודנטים, בוגרים ושותפים נבחרים."),
        ("#/publications", "פרסומים", "בחירה מערכתית ורשימה מלאה ב־Google Scholar."),
        ("#/contact", "קשר", "פודקאסט, שיתופי פעולה ו־HFP; חלק מהמידע עדיין בהמתנה."),
        ("#/characterize", "מצב אפיון", "שאלון אינטראקטיבי לאיסוף החלטות עם ליאור."),
    ]
    for route, page, role in routes:
        add_status_row(table, [route, page, role], rtl_cols={1, 2}, bold_first=False)

    add_heading(doc, "התנהגות מעטפת", 2)
    add_bullet(doc, "ברירת המחדל היא אנגלית; כפתור עב/EN משנה גם lang וגם dir ברמת המסמך.")
    add_bullet(doc, "התפריט ממוקם בצד ההתחלתי של השפה; כפתורי שפה/קשר/אפיון נמצאים בצד הנגדי.")
    add_bullet(doc, "סרגל התקדמות מציג מיקום 01/08 ואת שם המסך הנוכחי.")
    add_bullet(doc, "כפתורי Back/Next בפוטר מאפשרים מעבר ליניארי לצד הניווט הראשי.")

    # 4 — visual design
    doc.add_page_break()
    add_chapter_title(doc, "04", "מערכת העיצוב", "הפרק המרכזי למסירה: מה לשמר, מה לשפר, ומה לא להפוך לגנרי")
    add_heading(doc, "כיוון חזותי", 2)
    add_para(doc, "מינימליזם אקדמי־מערכתי עם אופי מערכתי של קטלוג/כתב־עת: הרבה אוויר, טיפוגרפיה שחורה גדולה, קווים דקים, סימנים גאומטריים ומעט צבע מושתק. ההשראה העיקרית היא אתר Shenkar שנמסר כדוגמה, יחד עם dumit.net, אך העיצוב אינו העתקה ישירה.")
    add_callout(doc, "האיזון הרצוי", "אינטלקטואלי ומדויק, אבל לא סטרילי; מחקרי, אבל לא אתר מחלקה; אינטראקטיבי, אבל לא משחקי או ילדותי.", fill=WARM, accent=TAUPE)

    add_heading(doc, "פלטת צבעים", 2)
    palette_rows = [
        ("Ink", "#11110F", "טקסט וקווים ראשיים"),
        ("Gray", "#73736F", "מטא־דאטה וטקסט משני"),
        ("Home", "#F4F0E9 / #AE9A87", "שמנת חמה + טאופ"),
        ("About", "#E9EEEA / #9CAB9D", "ירקרק־אפור"),
        ("Research", "#E8EDF0 / #8EA3AD", "כחול־אפור"),
        ("Projects", "#EDF0E8 / #96A184", "זית מעושן"),
        ("Lab", "#EEEAF0 / #A297A8", "סגלגל־אפור"),
        ("Publications", "#F1E9E4 / #B49382", "ורדרד־אדמה"),
        ("Contact", "#F0ECE4 / #A98F78", "חול חם"),
        ("Characterize", "#EEE9DF / #9F806C", "בז׳ עמוק"),
    ]
    table = doc.add_table(rows=1, cols=3)
    for i, h in enumerate(["Token", "ערך", "שימוש"]):
        cell = table.rows[0].cells[i]
        set_cell_shading(cell, LIGHT_BLUE)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        set_font(r, size=9, color=DARK_BLUE, bold=True)
        if i == 2:
            set_rtl(p)
    set_table_geometry(table, [1700, 2700, 4960])
    set_repeat_rows(table)
    for token, value, use in palette_rows:
        row = add_status_row(table, [token, value, use], rtl_cols={2}, bold_first=True)
        if token not in ("Ink", "Gray"):
            fill = value.split(" / ")[0].replace("#", "")
            set_cell_shading(row.cells[0], fill)

    add_heading(doc, "טיפוגרפיה והיררכיה", 2)
    add_bullet(doc, "כותרות וטקסט: Arial / Helvetica Neue, sans-serif. כותרות גדולות מאוד, משקל בינוני, tracking שלילי.")
    add_bullet(doc, "מספור, תוויות ומטא־דאטה: Courier New בגודל קטן, אותיות רישיות באנגלית וריווח אותיות עדין.")
    add_bullet(doc, "היררכיה נוצרת בעיקר מקנה מידה, מיקום ורווח לבן — לא מצלליות, gradients או צבעים חזקים.")
    add_bullet(doc, "תמונות מוצגות בשחור־לבן עם mix-blend-mode:multiply כדי להשתלב במשטח הצבעוני.")

    # 5 — layout and interaction
    doc.add_page_break()
    add_chapter_title(doc, "05", "פריסה, רכיבים ואינטראקציה", "איך שפת העיצוב מתורגמת לממשק עובד")
    add_heading(doc, "גריד וקצב", 2)
    add_bullet(doc, "Desktop: גריד 12 עמודות, שוליים רספונסיביים ופריסות א־סימטריות מכוונות.")
    add_bullet(doc, "רווחים נדיבים בין פרקים (לרוב 90–120px) כדי להדגיש קצב עריכתי ולא צפיפות של dashboard.")
    add_bullet(doc, "קווים בעובי 1px מגדירים אזורים; משטחים לבנים חצי־שקופים משמשים רק כשנדרש עיגון.")
    add_bullet(doc, "הטקסט נשאר ברוחב קריא; הכותרות יכולות להתרחב על פני הגריד ולייצר מחווה חזותית.")

    add_heading(doc, "רכיבים מרכזיים", 2)
    components = [
        ("Header", "תפריט מבוסס סימנים גאומטריים + תוויות; מצב פעיל מסומן בצבע הדף ובקו קצר."),
        ("Home hero", "פורטרט, שם ותפקיד, משפט מוביל, CTA, metadata folio וציר MOVE–LISTEN–CREATE."),
        ("Page title", "Kicker ממוספר בצד + כותרת גדולה ותיאור קצר, בפריסה לא סימטרית."),
        ("Research browser", "רשימת טאבים משמאל/מימין ופאנל פירוט; הבחירה מעדכנת גם את מצב האפיון הפנימי."),
        ("Project cards", "גריד שני טורים, מספור, קטגוריה, כותרת ותיאור; hover עדין בלבד."),
        ("Publication rows", "שורות עריכתיות עם שנה, כותרת, כתב עת וסימן חץ; תנועה קטנה ב־hover."),
        ("Footer", "ניווט קודם/הבא והפניה למסך האפיון לאחר עמוד הקשר."),
    ]
    for title, desc in components:
        add_mixed_para(doc, [(title + " — ", {"size": 11, "color": DARK_BLUE, "bold": True}), (desc, {"size": 11, "color": INK})], after=7)

    add_heading(doc, "Responsive", 2)
    add_bullet(doc, "מתחת ל־1000px: הגריד נשמר אך אזורי התוכן מתרחבים; סיכום האפיון מפסיק להיות sticky.")
    add_bullet(doc, "מתחת ל־720px: התפריט הופך לסרגל תחתון קבוע בגובה 64px, הפריסות הופכות לטור אחד וה־folio נעלם.")
    add_bullet(doc, "ברשימות מורכבות משתנים סדרי העמודות ורוחבי הטקסט כדי למנוע צפיפות והחלקה אופקית.")

    add_heading(doc, "נגישות ותנועה", 2)
    add_bullet(doc, "aria-current, tablist/tabpanel, aria-live ומיקוד אוטומטי לאזור המסך לאחר מעבר route.")
    add_bullet(doc, "focus-visible ברור לכל רכיב אינטראקטיבי.")
    add_bullet(doc, "prefers-reduced-motion מבטל כמעט לחלוטין אנימציות ומעברים.")
    add_bullet(doc, "החלפת השפה מעדכנת את כיוון המסמך ואת משמעות הצד ההתחלתי/הסופי בכל הרכיבים.")

    # 6 — page-by-page
    doc.add_page_break()
    add_chapter_title(doc, "06", "תכולת העמודים", "מפת תוכן קצרה לשחזור, הרחבה או כתיבה מחדש")
    pages = [
        ("ראשי", "מיצוב קצר, פורטרט, Creative Action Lab, CTA למחקר וכניסה לפודקאסט/קשר."),
        ("אודות", "הגדרה של מדע חישובי לשיתוף פעולה יצירתי; Observe / Model / Improvise; מסלול אקדמי."),
        ("מחקר", "Creative joint action; Exploration & discovery; Human-agent co-creativity; אזכור Theatre Lab."),
        ("פרויקטים", "Collective storytelling; Secure attachment & improvisation; Security & creativity; Collective creative exploration; Understanding slow motion; Online creativity games."),
        ("מעבדה", "Maor Rosenberg, Daniel Khanoukov, Paz, Rani, Prie; בוגרים Idan Vidra ו־Gal Kimron; שותפים נבחרים."),
        ("פרסומים", "שבעה מאמרים נבחרים מהשנים 2011–2025 וקישור לרשימה המלאה ב־Google Scholar."),
        ("קשר", "Podcast in Motion, שיתופי פעולה, Scientific leadership training ב־HFP. פרטי קשר עדיין בהמתנה."),
    ]
    for idx, (name, desc) in enumerate(pages, 1):
        add_mixed_para(doc, [(f"{idx:02d}  {name}", {"size": 12, "color": BLUE, "bold": True}), ("\n" + desc, {"size": 10.5, "color": INK})], after=10)

    add_heading(doc, "רשימת הפרסומים הנבחרת", 2)
    pubs = [
        "2025 — Submovements in manual tracking: People with Parkinson’s disease produce more submovements than age-matched controls — Journal of NeuroEngineering and Rehabilitation",
        "2024 — A slow limit: Extensive motor training cannot overcome a limit on the production of slow and smooth motion — Journal of Neurophysiology",
        "2024 — De-sync: Disruption of synchronization as a key factor in individual and collective creative processes — BMC Neuroscience",
        "2018 — Creative exploration as a scale-invariant search on a meaning landscape — Nature Communications",
        "2017 — Creative foraging: An experimental paradigm for studying the dynamics of exploration and discovery — PLOS ONE",
        "2015 — Being in the zone: Physiological markers of togetherness in joint improvisation — Frontiers in Human Neuroscience",
        "2011 — The mirror game as a paradigm for studying the dynamics of two people improvising motion together — PNAS",
    ]
    for pub in pubs:
        add_bullet(doc, pub)

    # 7 — characterization
    doc.add_page_break()
    add_chapter_title(doc, "07", "מצב האפיון", "כלי עבודה נפרד בתוך אותו SPA — לא עמוד שיווקי")
    add_callout(doc, "החלטת מסירה", "אין לשנות את app/CharacterizationWorkspace.tsx בסבב תוכן/עיצוב רגיל. הוא הוגדר על ידי המשתמש ככלי פעיל לאיסוף החלטות ויש לגעת בו רק לפי בקשה מפורשת.", fill="FDEFEA", accent=RED)
    add_heading(doc, "מה הוא עושה", 2)
    add_bullet(doc, "מציג שאלון אפיון ממוקד עם קלטים, בחירות יחידות וריבוי בחירות.")
    add_bullet(doc, "בכל אפשרות בחירה קיימת אפשרות ‘אחר’ עם שדה טקסט חופשי.")
    add_bullet(doc, "בשאלה ‘אילו אזורים חייבים להופיע באתר?’ ניתן להוסיף מספר שדות ‘אחר’; מילוי שדה יוצר שדה נוסף.")
    add_bullet(doc, "שומר את התשובות ב־localStorage כדי לא לאבד עבודה בין מעברים או רענון.")
    add_bullet(doc, "מציג אחוז התקדמות וסיכום חי של התשובות.")
    add_bullet(doc, "מאפשר העתקת סיכום, הורדה לקובץ ואיפוס הטופס.")

    add_heading(doc, "הקשר לעיצוב", 2)
    add_para(doc, "העמוד משתמש באותה מעטפת צבע, טיפוגרפיה וקווים, אך עובד כ־workspace: שאלות רחבות משמאל/מימין וסיכום sticky בצד. במובייל הסיכום נכנס לזרימה והבחירות הופכות לטור אחד. בכך ליאור יכול לבחון החלטות כשהוא רואה את הפרוטוטייפ עצמו ולא שאלון מנותק.")
    add_heading(doc, "בדיקת שמירה", 2)
    add_para(doc, "SHA-256 מתועד של הקובץ שלא שונה: 1763124CBABC8C3EEC797103646574CB44373D596C3F390C112FC688D7DFDC95", size=9.5, color=GRAY, rtl=False, align=WD_ALIGN_PARAGRAPH.LEFT)

    # 8 — technical
    doc.add_page_break()
    add_chapter_title(doc, "08", "מימוש טכני ואיכות", "מידע מספיק כדי להרים את הפרויקט, לבדוק אותו ולשמור על ההתנהגות הקיימת")
    add_heading(doc, "Stack", 2)
    add_bullet(doc, "React 19.2.6 + React DOM 19.2.6")
    add_bullet(doc, "Vite 8.0.13 באמצעות Vinext 0.0.50")
    add_bullet(doc, "TypeScript 5.9.3")
    add_bullet(doc, "Hosting מבוסס Cloudflare/Sites; D1 ו־R2 אינם מחוברים כרגע.")

    add_heading(doc, "קבצים מרכזיים", 2)
    file_rows = [
        ("app/page.tsx", "התוכן, השפות, ה־routes, מצב React והרכבת כל מסכי האתר."),
        ("app/globals.css", "מערכת העיצוב, הפלטה, הגריד, הרכיבים וה־breakpoints."),
        ("app/CharacterizationWorkspace.tsx", "שאלון האפיון האינטראקטיבי; אזור מוגן משינויים לא־מפורשים."),
        ("app/layout.tsx", "Metadata ומעטפת המסמך."),
        ("public/lior-noy.jpg", "תמונת הפרוטוטייפ הנוכחית; נדרשת החלפה בחומר מאושר."),
        ("public/favicon.svg", "סמל האתר."),
        ("tests/rendered-html.test.mjs", "בדיקות build/render, routes, מובייל, אפיון והגנות תוכן."),
        (".openai/hosting.json", "קישור לפרויקט hosting."),
    ]
    table = doc.add_table(rows=1, cols=2)
    for i, h in enumerate(["קובץ", "אחריות"]):
        cell = table.rows[0].cells[i]
        set_cell_shading(cell, LIGHT_BLUE)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        set_font(r, size=9, color=DARK_BLUE, bold=True)
        set_rtl(p)
    set_table_geometry(table, [3000, 6360])
    set_repeat_rows(table)
    for path, role in file_rows:
        add_status_row(table, [path, role], rtl_cols={1}, bold_first=True)

    add_heading(doc, "פקודות עבודה", 2)
    for cmd, meaning in [
        ("npm install", "התקנת תלויות"),
        ("npm run dev", "שרת פיתוח"),
        ("npm run lint", "בדיקת ESLint"),
        ("npm test", "Build ולאחריו בדיקות rendered HTML"),
        ("npm run build", "בניית production"),
    ]:
        add_mixed_para(doc, [(cmd, {"name": "Courier New", "size": 10, "color": DARK_BLUE, "bold": True}), ("  —  " + meaning, {"size": 10.5, "color": INK})], after=5, rtl=False, align=WD_ALIGN_PARAGRAPH.LEFT)

    add_heading(doc, "בדיקות שבוצעו", 2)
    add_bullet(doc, "npm run lint — עבר.")
    add_bullet(doc, "npm test — עבר לאחר העדכון האחרון.")
    add_bullet(doc, "הבדיקות מכסות build, routes, תפריט מובייל, שמירת מצב האפיון והיעדר טענות/פרטי קשר שלא אושרו.")

    # 9 — sources
    doc.add_page_break()
    add_chapter_title(doc, "09", "מקורות וסמכות תוכן", "האתר עודכן לפי מקורות שהוגדרו במפורש; כל הרחבה עתידית צריכה להישען על מקור מאושר")
    add_heading(doc, "מקורות העבודה", 2)
    add_bullet(doc, "lior-noy-site-characterization (2).txt — אפיון שסופק על ידי המשתמש.")
    add_bullet(doc, "CV - Lior Noy 2025 - Ono.pdf — קורות החיים שסופקו על ידי המשתמש.")
    add_bullet(doc, "Google Doc שסופק בהמשך — מבנה, רפרנסים, פרויקטים וחומרים שצריך לאסוף.")
    add_link_para(doc, "מסמך Google Docs", "https://docs.google.com/document/d/1-959LwRPfHF561NNRhf7VB23cIzEz0nXGMwvLjv-r4Q/edit?usp=sharing")

    add_heading(doc, "קישורי מחקר ותוכן", 2)
    for label, url in [
        ("Google Scholar — Lior Noy", "https://scholar.google.com/citations?user=-w05QJkAAAAJ&hl=en"),
        ("Weizmann Theatre Lab", "https://www.weizmann.ac.il/mcb/alon/theatre-lab"),
        ("HFP Consulting", "https://hfp-consulting.com/"),
        ("Lior Noy — HFP profile", "https://hfp-consulting.com/lior-noy/"),
        ("YouTube source", "https://www.youtube.com/watch?v=aQajqguCYRg"),
    ]:
        add_link_para(doc, label, url)

    add_heading(doc, "רפרנסים עיצוביים", 2)
    refs = [
        ("Interaction Design Shenkar — reference מרכזי", "https://interaction.shenkar.ac.il/board_members/full-name/"),
        ("Dumit — reference מרכזי", "https://dumit.net/"),
        ("Antonia Hamilton", "https://antoniahamilton.com/"),
        ("Landau Lab", "https://www.landaulab.com/"),
        ("Curious Jason", "https://curiousjason.netlify.app/#about"),
        ("Curiosity Lab", "https://curiositylab.sites.tau.ac.il/"),
    ]
    for label, url in refs:
        add_link_para(doc, label, url)

    add_heading(doc, "כללי ממשל תוכן", 2)
    add_bullet(doc, "לא להחזיר טענת Deputy Head / סגן ראש בית הספר — היא הוסרה לאחר הצלבה עם החומרים המאושרים.")
    add_bullet(doc, "לא להמציא דוא״ל, טלפון, קישור לפודקאסט או ביוגרפיות חסרות.")
    add_bullet(doc, "פרטי גישה, סיסמאות, תקציב ותפעול פנימי לא הוכנסו למסמך זה או לאתר. אם סיסמה אמיתית שותפה בעבר, מומלץ להחליף אותה.")

    # 10 — open gaps and action plan
    doc.add_page_break()
    add_chapter_title(doc, "10", "פערים פתוחים ותוכנית המשך", "הפעולות שיביאו את הפרוטוטייפ ממצב הצגה למצב אתר סופי")
    add_heading(doc, "חוסרים שדורשים חומר או החלטה מליאור", 2)
    gaps = [
        "תמונות מאושרות מרומיין: פורטרט, מעבדה, תנועה/אימפרוביזציה ותיעוד פרויקטים.",
        "ביוגרפיות ותמונות ל־Paz, Rani ו־Prie; השלמת מידע על Maor ו־Daniel לפי הצורך.",
        "אימות בוגר/ת נוסף/ת ששמו/ה הופיע באופן לא ודאי במסמך התכנון.",
        "קישור, תיאור, פרקים ו־media ל־Podcast in Motion.",
        "כתובת דוא״ל או טופס קשר מאושרים לפרסום.",
        "החלטה אם להוסיף News / Events ותוכן לאירועים עבר/עתיד.",
        "אימות ניסוח התפקיד הנוכחי והאזכור ‘Head, Computer Science Program — until recently’.",
        "החלטה על דומיין, ובכלל זה liornoy.com אם הוא זמין ומתאים.",
    ]
    for g in gaps:
        add_bullet(doc, g)

    add_heading(doc, "סדר עבודה מומלץ", 2)
    steps = [
        "לקיים פגישת אפיון עם ליאור דרך #/characterize ולייצא את הסיכום.",
        "לנעול את שם המעבדה, התפקיד הרשמי, קהלי היעד וה־CTA הראשי.",
        "לאסוף ולבחור מדיה; ליצור מפת שימוש לכל תמונה לפי עמוד ורזולוציה.",
        "להשלים ביוגרפיות, קשר, פודקאסט ואירועים מתוך מקורות מאושרים.",
        "לבצע סבב עריכה לשוני מלא בעברית ובאנגלית, כולל אחידות מונחים.",
        "להריץ QA רספונסיבי, נגישות, קישורים חיצוניים ותמונות.",
        "לפרסם גרסת staging, לקבל אישור מליאור ורק אז לפרוס לציבור.",
    ]
    for s in steps:
        add_number(doc, s)

    add_heading(doc, "Guardrails עיצוביים", 2)
    add_callout(doc, "לשמר", "הרבה whitespace, גריד א־סימטרי, כותרות גדולות, צבעים מאובקים, קווים דקים, metadata מונוספייס, תנועה שקטה והרגשה של כתב־עת מחקרי.", fill="E9EEEA", accent=GREEN)
    add_callout(doc, "להימנע", "Gamification, איורים ילדותיים, גרדיאנטים חזקים, כרטיסים עגולים גנריים, צבעי ניאון, עומס אייקונים, תפריטים לא תלויי שפה או אפקטים שמאפילים על המחקר.", fill="FDEFEA", accent=RED)

    # 11 — continuation checklist
    doc.add_page_break()
    add_chapter_title(doc, "11", "Checklist למסירה", "בדיקה קצרה לפני שממשיכים בסביבה החדשה")
    checks = [
        "להעתיק את כל תיקיית lior-noy-prototype, כולל .git ו־.openai.",
        "לוודא Node.js 22.13 ומעלה ולהריץ npm install.",
        "להריץ npm run lint ולאחריו npm test לפני כל שינוי משמעותי.",
        "להתייחס ל־app/page.tsx ול־app/globals.css כמקור האמת למוצר ולעיצוב.",
        "לא לשנות את CharacterizationWorkspace.tsx ללא בקשה מפורשת.",
        "להמשיך להשתמש ב־Hash Routing כדי לשמור על מבנה SPA וכפתורי Back/Forward.",
        "לבדוק תמיד עברית ואנגלית, Desktop ו־Mobile, כולל מיקום התפריט לפי כיוון השפה.",
        "לא לפרסם נתונים אישיים או טענות מקצועיות ללא מקור מאושר.",
        "לבדוק מהי הגרסה הציבורית בפועל לפני deploy, כי הקוד המקומי עשוי להיות מתקדם יותר.",
        "לשמור על פלטת הצבעים המושתקת והכיוון האקדמי־מערכתי כקו בסיס.",
    ]
    for c in checks:
        add_bullet(doc, "☐ " + c)

    add_heading(doc, "הערת סיום", 2)
    add_para(doc, "הפרוטוטייפ הנוכחי אינו רק סקיצה חזותית; הוא כבר מקודד החלטות אסטרטגיות לגבי זהות, מבנה, שפה, ניווט ואיסוף אפיון. לכן מומלץ שהשלב הבא יהיה השלמת חומר ואימות מול ליאור — ורק אחר כך redesign או הרחבת scope.", size=12, color=DARK_BLUE, bold=True, after=18)
    add_link_para(doc, "פתיחת האתר הציבורי", "https://lior-noy-creative-interactions.afik-yermi.chatgpt.site/")

    # Set RTL on table cells that were added before geometry where needed and avoid row splits.
    for table in doc.tables:
        for row in table.rows:
            tr_pr = row._tr.get_or_add_trPr()
            cant_split = OxmlElement("w:cantSplit")
            tr_pr.append(cant_split)

    doc.save(OUT)
    print(OUT.name)


if __name__ == "__main__":
    build()
