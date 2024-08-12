import { connect } from "$/database/index.ts";
import { toValidName } from "$/controllers/read.ts";


export const GetAcrossVersions = async (book: string, chapter: string, verse_num: string) => {
  const sql = connect();

  //WHERE books.name = '${toValidName(book)}' and chapters.number = ${chapter};`
  const name = `${toValidName(book)}`
  const chapter_idRaw = await sql`SELECT chapters.id from chapters 
  JOIN books ON chapters.book_id = books.id 
  WHERE books.name = ${name} and chapters.number = ${chapter};`
  const chapter_id = chapter_idRaw[0].id

  const verses = await sql`
    SELECT
      vd.verse AS verse_dhh,
      vp.verse AS verse_pdt,
      vrv.verse AS verse_rv1960,
      vr.verse AS verse_rv1995
    FROM
      verses_dhh vd
      JOIN verses_rv1995 vr ON vd.chapter_id = vr.chapter_id
      JOIN verses_pdt vp ON vd.chapter_id = vp.chapter_id
      JOIN verses_rv1960 vrv ON vd.chapter_id = vrv.chapter_id
      WHERE 
      vd.chapter_id = ${chapter_id} and vr.chapter_id = ${chapter_id}
      and vp.chapter_id = ${chapter_id} and vrv.chapter_id = ${chapter_id} 
      and vr.number = ${verse_num} and vd.number = ${verse_num} 
      and vp.number = ${verse_num} and vrv.number = ${verse_num}`;

  sql.end();
     
  return verses;

}

