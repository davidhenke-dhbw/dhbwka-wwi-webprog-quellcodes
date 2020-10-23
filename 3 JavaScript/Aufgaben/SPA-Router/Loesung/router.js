"use strict";

/**
 * Diese Klasse stellt einen so genannten Single Page Router dar. Sie überwacht
 * die momentan aktive URL (die sich durch Anklicken eines Links oder durch
 * Setzen von window.location.href in JavaScript jederzeit ändern kann) und
 * sorgt dafür, dass der für die jeweilige URL richtige Inhalt angezeigt wird.
 *
 * Hierzu muss der Klasse bei ihrer Instantiierung eine Liste mit Routen
 * mitgegeben werden, die jeweils einen regulären Ausdrück zur Prüfung der
 * URL sowie eine Funktion zur Anzeige des dazugehörigen Inhalts besitzen.
 */
class Router {
    /**
     * Konstruktor.  Im Parameter routes muss eine Liste mit den vorhandenen
     * URL-Routen der App übergeben werden. Die Liste muss folgendes Format
     * haben:
     *
     *      [
     *          {
     *              url: "^/$"              // Regulärer Ausdruck zur URL
     *              show: matches => {...}  // Funktion zur Anzeige des Inhalts
     *          }, {
     *              url: "^/Details/(.*)$"  // Regulärer Ausdruck zur URL
     *              show: matches => {...}  // Funktion zur Anzeige des Inhalts
     *          },
     *          ...
     *      ]
     *
     * @param {List} routes Definition der in der App verfügbaren Seiten
     */
    constructor(routes) {
        this._routes = routes;
        this._started = false;

        window.addEventListener("hashchange", () => this._handleRouting());
    }

    /**
     * Routing starten und erste Route direkt aufrufen.
     */
    start() {
        this._started = true;
        this._handleRouting();
    }

    /**
     * Routing stoppen, so dass der Router nicht mehr aktiv wird, wenn Link
     * angeklickt wird oder sich die URL der Seite sonst irgendwie ändert.
     */
    stop() {
        this._started = false;
    }

    /**
     * Diese Methode wertet die aktuelle URL aus und sorgt dafür, dass die
     * dazu passende App-Seite geladen und angezeigt wird. Der Einfachheit
     * halber wird eine sog. Hash-URL verwendet, bei der die aufzurufende
     * Seite nach einem #-Zeichen stehen muss. Zum Beispiel:
     *
     *   http://localhost:8080/index.html#/Detail/1234
     *
     * Hier beschreibt "/Detail/1234" den Teil der URL mit der darzustellenden
     * Seite. Der Vorteil dieser Technik besteht darin, dass ein Link mit einer
     * solchen URL keine neue Seite vom Server lädt, wenn sich der vordere Teil
     * der URL (alles vor dem #-Zeichen) nicht verändert. Stattdessen wird
     * ein "hashchange"-Ereignis generiert, auf das wir hier reagieren können,
     * um die sichtbare Unterseite der App auszutauschen.
     *
     * Auf Basis der History-API und dem "popstate"-Ereignis lässt sich ein
     * noch ausgefeilterer Single Page Router entwickeln, der bei Bedarf auch
     * ohne das #-Zeichen in der URL auskommt. Dies würde jedoch sowohl mehr
     * Quellcode in JavaScript sowie eine spezielle Server-Konfiguration
     * erfordern, so dass der Server bei jeder URL immer die gleiche HTML-Seite
     * an den Browser schickt. Diesen Aufwand sparen wir uns deshalb hier. :-)
     */
    _handleRouting() {
        let url = location.hash.slice(1);

        if (url.length === 0) {
            url = "/";
        }

        let matches = null;
        let route = this._routes.find(p => matches = url.match(p.url));

        if (!page) {
            console.error(`Keine Route zur URL ${url} gefunden!`);
            return;
        }

        route.show(matches);
    }
}
