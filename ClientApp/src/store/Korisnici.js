const traziKorisnike = 'TRAZI_KORISNIKE';
const pozoviKorisnika = 'POZOVI_KORISNIKE';
const dodajKorisnika = 'DODAJ_KORISNIKE';
const initialState = { korisnici: [] };

const korisnici = [];

export const actionCreators = {
    traziKorisnike: () => async (dispatch, getState) => {
        dispatch({ type: traziKorisnike });
        const url = `api/Korisnici`;
        const fetchData = await fetch(url);
        const korisnici = await fetchData.json();
        dispatch({ type: pozoviKorisnika, korisnici });
    },
    dodajKorisnika: (korisnik) => async (dispatch, getState) => {
        const url = `api/Korisnici`;
        const objekat = JSON.stringify(
            { ime: korisnik.ime, prezime: korisnik.prezime, email: korisnik.email }
        );
        const fetchData = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: objekat
        }).then((objekat) => {
            dispatch({ type: dodajKorisnika, korisnik: objekat })
        });
    },
};

export const reducer = (state, action) => {
    state = state || initialState;
    if (action.type === traziKorisnike) {
        return {
            ...state
        };
    }
    if (action.type === pozoviKorisnika) {
        return {
            ...state,
            korisnici: action.korisnici
        }
    }

    return state;
}