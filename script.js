let player;
let trackName;
let pontos = 0;
let erros = 0;

function atualizarPontuacao() {
    const pontuacaoElement = document.getElementById("score");
    pontuacaoElement.innerText = `Pontuação: ${pontos}`;
}

function reiniciarJogo() {
    alert("Você errou 3 vezes e perdeu o jogo!");
    window.location.href = "index.html"; // Redireciona para a página de entrada
}

window.onSpotifyWebPlaybackSDKReady = () => {
    // Substitua o token abaixo a cada hora, precisa estar logado, através do link https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started
    const token = "BQAbSm2xTBzFisc--Ao2ULoqLWWpS3AsUrIIaSh_D3LW32PL272fet2C17NFJH9RXeaOVD2cUwaiLSdHjsTCQCkB-EkgUVBU0Wj6QXn-9JcD57_PilU9G-Phh6zHKBnDuzk2vBTyPGD3rgyxoGFHzByOcUz9xrWkOwjUXPc9L-Jx9PH6FiEOK_2ZSK5TN-zaFk7lhWH9LRZgw_l_j4Zgzpsx2jHz";
    player = new Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb) => {
            cb(token);
        },
        volume: 0.5,
    });

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        const connect_to_device = () => {
            let album_uri = "spotify:playlist:69WkDBevqA465t417myIEK?si=151ecae197504f59&nd=1";
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                method: "PUT",
                body: JSON.stringify({
                    context_uri: album_uri,
                    play: false,
                }),
                headers: new Headers({
                    "Authorization": "Bearer " + token,
                }),
            }).then(response => console.log(response))
                .then(data => {
                    player.addListener('player_state_changed', ({
                        track_window
                    }) => {
                        trackName = track_window.current_track.name;
                        trackName = trackName.toLowerCase().split('-')[0].trim(); // Pega a parte antes do traço
                        console.log('Current Track:', trackName);
                    });
                });
        }
        connect_to_device();
    });

    document.getElementById("play-music").addEventListener('click', () => {
        player.togglePlay();
        setTimeout(() => {
            player.pause();
        }, 13000);
    });

    document.getElementById("btn-resposta").addEventListener('click', (event) => {
        event.preventDefault();
        let resposta = document.getElementById("resposta").value;
        resposta = resposta.toLowerCase();
        resposta = resposta.split('-')[0].trim(); // Pega a parte antes do traço
        if (resposta == trackName) {
            alert("Você Acertou, Parabéns!");
            pontos += 10;
            atualizarPontuacao();
            document.getElementById("resposta").value = "";
            player.nextTrack();
            setTimeout(() => {
                player.pause();
            }, 1300);
        } else {
            alert("Você errou, tente novamente!");
            erros++;
            pontos -= 5; // Deduz 5 pontos por uma resposta incorreta
            atualizarPontuacao(); // Atualiza a interface com o novo valor dos pontos
            if (erros === 3) {
                reiniciarJogo();
            }
        }
    });
    player.connect();
};
