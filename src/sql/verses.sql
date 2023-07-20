
select verse, study, verses_dhh.number, verses_dhh.id  from verses_dhh 
JOIN chapters ON verses_dhh.chapter_id = chapters.id
JOIN books ON books.id = chapters.book_id WHERE chapter = 1 AND books.name = 'Mateo';

