// ==UserScript==
// @name             Wikipedia multi language view
// @name:en          Wikipedia multi language view
// @name:zh          Wikipedia 多语言浏览
// @name:ja          ウィキペディアの多言語表示
// @name:de          Wikipedia Mehrsprachige Ansicht
// @name:fr          Vue multilingue de Wikipédia
// @name:es          Vista multilingüe de Wikipedia
// @name:ru          Многоязычный вид Википедии
// @name:it          Visualizzazione multilingue di Wikipedia
// @name:ko          위키백과 다국어 보기
// @name:pt          Visualização multilíngue da Wikipédia
// @name:ar          عرض ويكيبيديا متعدد اللغات
// @name:vi          Chế độ xem đa ngôn ngữ của Wikipedia
// @name:pl          Wielojęzyczny widok Wikipedii
// @name:uk          Багатомовний перегляд Вікіпедії
// @name:nl          Meertalige weergave van Wikipedia
// @name:sv          Flerspråkig vy av Wikipedia
// @name:id          Tampilan multibahasa Wikipedia
// @name:fi          Monikielinen Wikipedia-näkymä
// @name:no          Flerspråklig visning av Wikipedia
// @namespace        https://userscript.snomiao.com/
// @author           snomiao@gmail.com
// @version          0.0.6
// @description      View a Wikipedia entry with two (or more?) languages side by side for comparison and language learning.
// @description:zh   以并列多语言视角浏览维基百科
// @description:ja   比較と語学学習のために、ウィキペディアの記事を2つ（またはそれ以上？）の言語で並べて表示します。
// @description:de   Vergleichen und Sprachen lernen: Wikipedia-Einträge in zwei (oder mehr?) Sprachen nebeneinander anzeigen.
// @description:fr  Affichez un article de Wikipédia dans deux (ou plusieurs ?) langues côte à côte pour la comparaison et l'apprentissage des langues.
// @description:es  Ver una entrada de Wikipedia en dos (¿o más?) idiomas lado a lado para comparar y aprender idiomas.
// @description:ru  Просмотр статьи Википедии на двух (или более?) языках рядом для сравнения и изучения языков.
// @description:it  Visualizza un articolo di Wikipedia in due (o più?) lingue affiancate per il confronto e l'apprendimento delle lingue.
// @description:ko  비교와 언어 학습을 위해 위키백과 항목을 두 개(또는 그 이상?)의 언어로 나란히 표시합니다.
// @description:pt  Visualize uma entrada da Wikipédia em dois (ou mais?) idiomas lado a lado para comparação e aprendizado de idiomas.
// @description:ar  عرض مقالة ويكيبيديا بلغة (أو أكثر؟) جنبًا إلى جنب للمقارنة وتعلم اللغات.
// @description:vi  Xem một bài viết trên Wikipedia bằng hai (hoặc nhiều hơn?) ngôn ngữ song song để so sánh và học ngôn ngữ.
// @description:pl  Wyświetl wpis Wikipedii w dwóch (lub więcej?) językach obok siebie w celu porównania i nauki języków.
// @description:uk  Перегляд статті Вікіпедії двома (або більше?) мовами поруч для порівняння та вивчення мов.
// @description:nl  Bekijk een Wikipedia-artikel in twee (of meer?) talen naast elkaar voor vergelijking en taalleren.
// @description:sv  Visa en Wikipedia-post på två (eller fler?) språk sida vid sida för jämförelse och språkinlärning.
// @description:id  Lihat entri Wikipedia dalam dua (atau lebih?) bahasa berdampingan untuk perbandingan dan pembelajaran bahasa.
// @description:fi  Näytä Wikipedia-artikkeli kahdella (tai useammalla?) kielellä rinnakkain vertailua ja kielten oppimista varten.
// @description:no  Vis en Wikipedia-artikkel på to (eller flere?) språk side om side for sammenligning og språklæring.
// @match            https://*.wikipedia.org/wiki/*
// @match            https://zh.wikipedia.org/zh-*/*
// @grant            none
// @run-at           document-start
// @license          GPL-3.0+
// @supportURL       https://github.com/snomiao/multilang-wiki/issues
// @downloadURL      https://github.com/snomiao/multilang-wiki/raw/main/multilang-wiki.user.js
// @contributionURL  https://snomiao.com/donate
// ==/UserScript==
//
// ref:
// [javascript - Resize Cross Domain Iframe Height - Stack Overflow]( https://stackoverflow.com/questions/22086722/resize-cross-domain-iframe-height )
//

// const Langs = ['en', 'ja', 'zh', 'de', 'fr', 'es', 'ru', 'it', 'ko', 'pt', 'ar', 'vi', 'pl', 'uk', 'nl', 'sv', 'id', 'fi', 'no', 'tr', 'cs', 'da', 'he', 'hu', 'ro', 'th']
const langs = ['en', 'ja', 'zh'] // modify this to your preferred languages, will be used to load the 2nd language iframe
// 

if (location.hash.match("#langIfr")) {
    // iframe code send height
    const sendHeight = () =>
        parent.postMessage?.(
            { langIfr: { height: document.body.scrollHeight } },
            "*"
        );
    window.addEventListener("resize", sendHeight, false);
    window.addEventListener("load", sendHeight, false);
    sendHeight();
    document.head.appendChild(createHtmlElement('<base target="_parent" />'))
} else {
    // parent code recv iframe's height
    const msgHandler = (e) => {
        const setHeight = (height) =>
            height &&
            document.querySelector("#langIfr")?.setAttribute("height", height);
        setHeight(e.data?.langIfr?.height);
    };
    window.addEventListener("message", msgHandler, false);
    // load iframe
    const langLnksGet = () =>
        Object.fromEntries(
            [...document.querySelectorAll("a.interlanguage-link-target")]
                .map((e) => ({
                    lang: e.getAttribute("lang"),
                    href: e.href,
                    language: e.textContent,
                }))
                .map((e) => [e.lang, e])
        );
    const exlangFrameLoad = () => {
        const langLnks = langLnksGet();
        const langIframeLoad = (lang = "en") => {
            if (!langLnks[lang]) return false;
            document.body.setAttribute("style", "width: 50vw");
            document.body.querySelector("#langIfr")?.remove();
            document.querySelector("#sidebarCollapse")?.click();
            const langIfr = Object.assign(document.createElement("iframe"), {
                id: "langIfr",
                src: langLnks[lang].href + "#langIfr",
            });
            langIfr.setAttribute(
                "style",
                "border: none; position:absolute; left: 50vw; top: 0vh; width: 50vw"
            );
            document.body.appendChild(langIfr);
            return true;
        };

        // the load 2st language for current page
        langs.find(lang => langIframeLoad(lang))
    };
    window.addEventListener("load", exlangFrameLoad, false);
}

function createHtmlElement(innerHTML= '<span>hello</span>'){
  return Object.assign(document.createElement('div'), {innerHTML}).children[0]
}