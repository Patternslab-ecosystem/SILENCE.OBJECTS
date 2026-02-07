'use client';

export default function PatternLensApp() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#00f7ff">
    <title>PatternLens v4.1</title>
    
    <style>
        /* WKLEJ TUTAJ CALY CSS Z HTML DOKUMENTU */
        /* (wszystko miedzy <style> a </style> z twojego HTML) */
    </style>
</head>
<body data-theme="dark">
    <!-- WKLEJ TUTAJ CALY CONTENT Z <body> HTML DOKUMENTU -->
    
    <script>
        /* WKLEJ TUTAJ CALY JAVASCRIPT Z HTML DOKUMENTU */
    </script>
</body>
</html>
      `
    }} />
  );
}
