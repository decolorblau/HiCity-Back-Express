# Claudia_Back-Final-Project-202109

## USER:

## USER ROUTES:

FET - POST - "user/login" - Body: {email, password}

FET - POST - "user/register" - Body: {name, email, password} - if find email --> error email exist

## LANDMARK:

## LANDMARK ROUTES: (ONL POST PUT NEED TOKEN)

FET - GET - "landmark/"; nothing

FET - GET - "landmark/:id" - Param {landmarkId}

FET - POST - "landmark/new" + auth(token - userID) - firebase - Body { title, city, imageUrl, category, latitude, longitude, lastUpdate, introduction, description,} -if find latitude and longitude --> error landmark exist

FET - PUT - "landmark/:id" + auth(token - userID) - firebase - Param {landmarkId} + Body { title, city, imageUrl, category, latitude, longitude, lastUpdate, introduction, description,}

## FOLDER:

## FOLDER ROUTES: (ALL NEED TOKEN)

GET - "folder/" + auth(token - userID) - req.params {userId}

POST - "folder/new" + auth(token - userID) - req.params {userId} + Body { name, userId, listLandmarks, creationDate} -if find name --> error this folder exist

DELETE - "folder/:id" + auth(token - userID) - req.params {userId, folderId}

PUT - "folder/:id" + auth(token - userID) - req.params {userId, folderId} + Body { name }

PATCH - "landmark/new" + auth(token - userID) - req.params {userId, landmarkId}

PATCH - "landmark/delete" + auth(token - userID) - req.params {userId, landmarkId}
