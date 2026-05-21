UPDATE t_p17442137_101_outp_social_netw.gallery_photos
SET url = REPLACE(url, '/files/gallery/', '/bucket/gallery/')
WHERE url LIKE '%/files/gallery/%';