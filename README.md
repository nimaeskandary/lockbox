# lockbox
file sharing website using mysql and node

Group project for a cs class, goal was to create a simpe to use file sharing website in which users uploaded files or text, were givin a
uuid, and going to the root of the website /<uuid> would download the file. Files were stored on a vm hosting the website through Node express,
and the paths of the files were stored in a sql database that would delete files after 7 days
