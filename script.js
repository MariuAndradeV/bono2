fetch('romance.csv')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        // Parse CSV data
        const movies = Papa.parse(data, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
        }).data;

        // Convert 'gross(in $)' to numeric
        movies.forEach(movie => {
            if (typeof movie['gross(in $)'] === 'string') {
                movie['gross(in $)'] = parseFloat(movie['gross(in $)'].replace(/[$,]/g, ''));
            }
        });

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

        let plotData = [
            {
                x: grossData,
                y: yearsData,
                type: 'bar',
                orientation: 'h',
                text: namesData,
                textposition: grossData.map(gross => gross < 100000000 ? 'outside' : 'inside'),
                marker: {
                    color: grossData.map(gross => gross > 500000000 ? 'rgba(255,100,145,255)' : 'rgba(13,56,96,255)'),
                    hovertemplate: ' %{y}: $%{x}<br>%{text}'
                }
            }
        ];

        let layout = {
            yaxis: {
                title: '',
                automargin: true,
                tickvals: yearsData,
                tickmode: 'array'
            },
            xaxis: {
                title: '',
                tickformat: '$,.0f'
            },
            margin: {
                l: 80, r: 50, t: 50, b: 50
            },
            paper_bgcolor: 'rgba(0, 0, 0, 0)',
            plot_bgcolor: 'rgba(0, 0, 0, 0)'
        };

        Plotly.newPlot('myPlot', plotData, layout);

        let currentAudio = null;

        document.getElementById('myPlot').on('plotly_click', function(data) {
            let year = data.points[0].y;
            let movieName = data.points[0].text;
            let grossValue = data.points[0].x; // Gross value of the clicked movie

            // Calculate volume based on gross value (adjust these values as needed)
            let volume = grossValue / Math.max(...grossData); // Normalize to a value between 0 and 1

            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Create a new audio object
            currentAudio = new Audio("https://whyp.it/tracks/279856/cash-register?token=9aKMA");  // Replace with your audio file
            currentAudio.volume = volume;  // Set volume based on the gross value
            currentAudio.play();
        });
    })
    .catch(error => {
        console.error('No se pudo leer el archivo:', error);
    });
