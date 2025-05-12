ReadMe - Película Más Vendida Por Año - Plotly Y Tone

Este proyecto visualiza las películas de romance más taquilleras por año en los últimos 10 años utilizando Plotly para los gráficos y se acompaña de efectos de sonido que varían según la recaudación de cada película.

Cabe recalcar que el dataset tiene peliculas hasta el 2022, por lo tanto, las peliculas mostradas son a partir de dicha fecha (2022 - 2013).

Funcionalidad

Gráfica de barras horizontales que muestra la recaudación en dólares ($) de las películas más taquilleras por año.

Al hacer clic en una barra, se reproduce un sonido de dinero relacionado, cuyo volumen varía dependiendo del monto recaudado (gross).

Referencias al Código

Utilicé ChatGPT para redactar la función que calcula la película con mayor recaudación por año, basada en los datos del CSV. Ademas, de la debida preparacion de los datos antes de formar la grafica. 

        // Get the last 10 years
        const years = [...new Set(movies.map(movie => movie.year).filter(year => year <= 2022))].sort((a, b) => b - a).slice(0, 10);

        // Filter and get the highest grossing movie per year
        const topGrossMovies = years.map(year => {
            const moviesByYear = movies.filter(movie => movie.year === year && !isNaN(movie['gross(in $)']));
            const topMovie = moviesByYear.reduce((max, movie) => movie['gross(in $)'] > max['gross(in $)'] ? movie : max, { 'gross(in $)': 0 });
            return {
                year: year,
                movie_name: topMovie.movie_name,
                gross: topMovie['gross(in $)']
            };
        });

        // Prepare data for the plot
        const yearsData = topGrossMovies.map(movie => movie.year).reverse();
        const grossData = topGrossMovies.map(movie => movie.gross).reverse();
        const namesData = topGrossMovies.map(movie => movie.movie_name).reverse();


Diseño

El diseño está basado en el proporcionado en la ayudantía. Link: https://fernanda-bley.github.io/Ejemplos-Ayudantias-IIC2026/ejemplo-bonus-2/index.html 

Audios

El audio utilizado se obtuvo de Pixabay: https://pixabay.com/sound-effects/search/cash/