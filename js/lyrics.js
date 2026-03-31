// ==========================================
// TTLLyrics — 歌詞生成 + モーラ展開 + フォルマントデータ
// v2: 事前構成済みフレーズ断片方式
// ==========================================
(function() {
    'use strict';

    // ======== KANA → Vowel Mapping ========
    var KANA_VOWEL = {
        'あ':'a','い':'i','う':'u','え':'e','お':'o',
        'か':'a','き':'i','く':'u','け':'e','こ':'o',
        'さ':'a','し':'i','す':'u','せ':'e','そ':'o',
        'た':'a','ち':'i','つ':'u','て':'e','と':'o',
        'な':'a','に':'i','ぬ':'u','ね':'e','の':'o',
        'は':'a','ひ':'i','ふ':'u','へ':'e','ほ':'o',
        'ま':'a','み':'i','む':'u','め':'e','も':'o',
        'や':'a','ゆ':'u','よ':'o',
        'ら':'a','り':'i','る':'u','れ':'e','ろ':'o',
        'わ':'a','を':'o',
        'が':'a','ぎ':'i','ぐ':'u','げ':'e','ご':'o',
        'ざ':'a','じ':'i','ず':'u','ぜ':'e','ぞ':'o',
        'だ':'a','ぢ':'i','づ':'u','で':'e','ど':'o',
        'ば':'a','び':'i','ぶ':'u','べ':'e','ぼ':'o',
        'ぱ':'a','ぴ':'i','ぷ':'u','ぺ':'e','ぽ':'o',
        'ん':'n','っ':null,
        'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
        'カ':'a','キ':'i','ク':'u','ケ':'e','コ':'o',
        'サ':'a','シ':'i','ス':'u','セ':'e','ソ':'o',
        'タ':'a','チ':'i','ツ':'u','テ':'e','ト':'o',
        'ナ':'a','ニ':'i','ヌ':'u','ネ':'e','ノ':'o',
        'ハ':'a','ヒ':'i','フ':'u','ヘ':'e','ホ':'o',
        'マ':'a','ミ':'i','ム':'u','メ':'e','モ':'o',
        'ヤ':'a','ユ':'u','ヨ':'o',
        'ラ':'a','リ':'i','ル':'u','レ':'e','ロ':'o',
        'ワ':'a','ヲ':'o',
        'ガ':'a','ギ':'i','グ':'u','ゲ':'e','ゴ':'o',
        'ザ':'a','ジ':'i','ズ':'u','ゼ':'e','ゾ':'o',
        'ダ':'a','ヂ':'i','ヅ':'u','デ':'e','ド':'o',
        'バ':'a','ビ':'i','ブ':'u','ベ':'e','ボ':'o',
        'パ':'a','ピ':'i','プ':'u','ペ':'e','ポ':'o',
        'ン':'n','ッ':null,
        'ー':'a'
    };

    // ======== FORMANTS Table (F1, F2 Hz) ========
    var FORMANTS = {
        a: [800, 1200],
        i: [300, 2300],
        u: [300, 1000],
        e: [500, 1800],
        o: [500, 1000],
        n: [300, 800]
    };

    // ======== PHRASES — 自然な日本語フレーズ断片 ========
    // Each: { kana, kanji, mora, tags[] }
    // 手動でモーラ数を設定（拗音=1モーラ、っ=1モーラ、ん=1モーラ）
    var PHRASES = [
        // ===== 1 mora =====
        { kana: "ね", kanji: "ね", mora: 1, tags: ["social"] },
        { kana: "よ", kanji: "よ", mora: 1, tags: ["expressive"] },
        { kana: "さ", kanji: "さ", mora: 1, tags: [] },
        { kana: "も", kanji: "も", mora: 1, tags: [] },

        // ===== 2 mora =====
        { kana: "かぜ", kanji: "風", mora: 2, tags: ["adventurous","calm"] },
        { kana: "そら", kanji: "空", mora: 2, tags: ["optimistic","adventurous"] },
        { kana: "うみ", kanji: "海", mora: 2, tags: ["adventurous","calm"] },
        { kana: "ゆめ", kanji: "夢", mora: 2, tags: ["optimistic","creative"] },
        { kana: "ほし", kanji: "星", mora: 2, tags: ["curious","optimistic"] },
        { kana: "はな", kanji: "花", mora: 2, tags: ["optimistic","calm"] },
        { kana: "うた", kanji: "歌", mora: 2, tags: ["expressive","creative"] },
        { kana: "こえ", kanji: "声", mora: 2, tags: ["social","expressive"] },
        { kana: "みち", kanji: "道", mora: 2, tags: ["adventurous","patient"] },
        { kana: "つき", kanji: "月", mora: 2, tags: ["calm","optimistic"] },
        { kana: "もり", kanji: "森", mora: 2, tags: ["calm","adventurous"] },
        { kana: "なみ", kanji: "波", mora: 2, tags: ["calm","adventurous"] },
        { kana: "はる", kanji: "春", mora: 2, tags: ["optimistic","active"] },
        { kana: "なつ", kanji: "夏", mora: 2, tags: ["active","optimistic"] },
        { kana: "あき", kanji: "秋", mora: 2, tags: ["calm","creative"] },
        { kana: "ふゆ", kanji: "冬", mora: 2, tags: ["calm","patient"] },
        { kana: "あさ", kanji: "朝", mora: 2, tags: ["optimistic","active"] },
        { kana: "よる", kanji: "夜", mora: 2, tags: ["calm","patient"] },
        { kana: "あい", kanji: "愛", mora: 2, tags: ["empathetic","social"] },
        { kana: "たび", kanji: "旅", mora: 2, tags: ["adventurous","curious"] },
        { kana: "いろ", kanji: "色", mora: 2, tags: ["creative","expressive"] },
        { kana: "おと", kanji: "音", mora: 2, tags: ["creative","expressive"] },
        { kana: "にじ", kanji: "虹", mora: 2, tags: ["optimistic","creative"] },
        { kana: "くも", kanji: "雲", mora: 2, tags: ["calm","optimistic"] },
        { kana: "あめ", kanji: "雨", mora: 2, tags: ["calm","patient"] },
        { kana: "まち", kanji: "街", mora: 2, tags: ["social","adventurous"] },
        { kana: "いえ", kanji: "家", mora: 2, tags: ["calm","empathetic"] },
        { kana: "いま", kanji: "今", mora: 2, tags: ["focused","active"] },
        // fillers 2
        { kana: "ほら", kanji: "ほら", mora: 2, tags: ["active","expressive"] },
        { kana: "さあ", kanji: "さあ", mora: 2, tags: ["active","adventurous"] },
        { kana: "ねえ", kanji: "ねえ", mora: 2, tags: ["social","expressive"] },
        { kana: "ああ", kanji: "ああ", mora: 2, tags: ["expressive"] },
        { kana: "もう", kanji: "もう", mora: 2, tags: ["patient"] },
        { kana: "まだ", kanji: "まだ", mora: 2, tags: ["patient","resilient"] },

        // ===== 3 mora =====
        { kana: "ひかり", kanji: "光", mora: 3, tags: ["optimistic","creative"] },
        { kana: "こころ", kanji: "心", mora: 3, tags: ["focused","empathetic"] },
        { kana: "みらい", kanji: "未来", mora: 3, tags: ["optimistic","adventurous"] },
        { kana: "ゆうき", kanji: "勇気", mora: 3, tags: ["resilient","adventurous"] },
        { kana: "きぼう", kanji: "希望", mora: 3, tags: ["resilient","optimistic"] },
        { kana: "ことば", kanji: "言葉", mora: 3, tags: ["expressive","social"] },
        { kana: "なかま", kanji: "仲間", mora: 3, tags: ["social","active"] },
        { kana: "せかい", kanji: "世界", mora: 3, tags: ["adventurous","curious"] },
        { kana: "きせき", kanji: "奇跡", mora: 3, tags: ["lucky","optimistic"] },
        { kana: "えがお", kanji: "笑顔", mora: 3, tags: ["social","optimistic"] },
        { kana: "きずな", kanji: "絆", mora: 3, tags: ["social","empathetic"] },
        { kana: "きせつ", kanji: "季節", mora: 3, tags: ["patient","calm"] },
        { kana: "じかん", kanji: "時間", mora: 3, tags: ["patient","calm"] },
        { kana: "いのち", kanji: "命", mora: 3, tags: ["resilient","optimistic"] },
        { kana: "きおく", kanji: "記憶", mora: 3, tags: ["patient","empathetic"] },
        { kana: "つばさ", kanji: "翼", mora: 3, tags: ["adventurous","optimistic"] },
        { kana: "かおり", kanji: "香り", mora: 3, tags: ["calm","creative"] },
        { kana: "つよさ", kanji: "強さ", mora: 3, tags: ["resilient","focused"] },
        { kana: "なみだ", kanji: "涙", mora: 3, tags: ["empathetic","expressive"] },
        { kana: "かたち", kanji: "形", mora: 3, tags: ["creative","focused"] },
        { kana: "こたえ", kanji: "答え", mora: 3, tags: ["study","focused"] },
        { kana: "とびら", kanji: "扉", mora: 3, tags: ["adventurous","curious"] },
        { kana: "しるし", kanji: "印", mora: 3, tags: ["creative","focused"] },
        { kana: "ちから", kanji: "力", mora: 3, tags: ["resilient","active"] },
        // verbs 3
        { kana: "あるく", kanji: "歩く", mora: 3, tags: ["patient","calm"] },
        { kana: "さがす", kanji: "探す", mora: 3, tags: ["curious","adventurous"] },
        { kana: "すすむ", kanji: "進む", mora: 3, tags: ["adventurous","focused"] },
        { kana: "まもる", kanji: "守る", mora: 3, tags: ["focused","patient"] },
        { kana: "ひびく", kanji: "響く", mora: 3, tags: ["expressive","creative"] },
        { kana: "おどる", kanji: "踊る", mora: 3, tags: ["active","expressive"] },
        { kana: "うたう", kanji: "歌う", mora: 3, tags: ["expressive","active"] },
        { kana: "えがく", kanji: "描く", mora: 3, tags: ["creative","expressive"] },
        { kana: "まなぶ", kanji: "学ぶ", mora: 3, tags: ["curious","study"] },
        { kana: "つくる", kanji: "作る", mora: 3, tags: ["creative","focused"] },
        { kana: "ひらく", kanji: "開く", mora: 3, tags: ["adventurous","creative"] },
        { kana: "いきる", kanji: "生きる", mora: 3, tags: ["resilient","focused"] },
        { kana: "ゆたか", kanji: "豊か", mora: 3, tags: ["creative","optimistic"] },
        // advs/fillers 3
        { kana: "きっと", kanji: "きっと", mora: 3, tags: ["optimistic","resilient"] },
        { kana: "ずっと", kanji: "ずっと", mora: 3, tags: ["patient","empathetic"] },
        { kana: "そっと", kanji: "そっと", mora: 3, tags: ["cautious","calm"] },
        { kana: "もっと", kanji: "もっと", mora: 3, tags: ["active","curious"] },
        { kana: "ラララ", kanji: "ラララ", mora: 3, tags: ["expressive","optimistic"] },
        // short phrases 3
        { kana: "きみと", kanji: "君と", mora: 3, tags: ["social","empathetic"] },
        { kana: "ぼくの", kanji: "僕の", mora: 3, tags: ["focused","expressive"] },
        { kana: "あのひ", kanji: "あの日", mora: 3, tags: ["patient","empathetic"] },
        { kana: "このて", kanji: "この手", mora: 3, tags: ["focused","active"] },
        { kana: "かぜに", kanji: "風に", mora: 3, tags: ["adventurous","calm"] },
        { kana: "そらへ", kanji: "空へ", mora: 3, tags: ["optimistic","adventurous"] },
        { kana: "ゆめの", kanji: "夢の", mora: 3, tags: ["optimistic","creative"] },

        // ===== 4 mora =====
        // adjectives
        { kana: "やさしい", kanji: "優しい", mora: 4, tags: ["empathetic","calm"] },
        { kana: "あかるい", kanji: "明るい", mora: 4, tags: ["optimistic","active"] },
        { kana: "たのしい", kanji: "楽しい", mora: 4, tags: ["social","optimistic"] },
        { kana: "かがやく", kanji: "輝く", mora: 4, tags: ["optimistic","expressive"] },
        { kana: "にぎやか", kanji: "賑やか", mora: 4, tags: ["social","active"] },
        { kana: "おだやか", kanji: "穏やか", mora: 4, tags: ["patient","calm"] },
        { kana: "あざやか", kanji: "鮮やか", mora: 4, tags: ["expressive","creative"] },
        // verbs 4
        { kana: "つたえる", kanji: "伝える", mora: 4, tags: ["expressive","empathetic"] },
        { kana: "つづける", kanji: "続ける", mora: 4, tags: ["focused","patient"] },
        { kana: "みつめる", kanji: "見つめる", mora: 4, tags: ["focused","calm"] },
        { kana: "かなでる", kanji: "奏でる", mora: 4, tags: ["expressive","creative"] },
        { kana: "がんばる", kanji: "頑張る", mora: 4, tags: ["resilient","focused"] },
        { kana: "しんじる", kanji: "信じる", mora: 4, tags: ["resilient","empathetic"] },
        { kana: "つながる", kanji: "繋がる", mora: 4, tags: ["social","empathetic"] },
        { kana: "みつける", kanji: "見つける", mora: 4, tags: ["curious","focused"] },
        { kana: "みまもる", kanji: "見守る", mora: 4, tags: ["patient","empathetic"] },
        { kana: "ささえる", kanji: "支える", mora: 4, tags: ["empathetic","patient"] },
        { kana: "よりそう", kanji: "寄り添う", mora: 4, tags: ["empathetic","social"] },
        { kana: "ほほえむ", kanji: "微笑む", mora: 4, tags: ["empathetic","social"] },
        // nouns 4
        { kana: "ともだち", kanji: "友達", mora: 4, tags: ["social","empathetic"] },
        { kana: "はじまり", kanji: "始まり", mora: 4, tags: ["optimistic","adventurous"] },
        { kana: "おもいで", kanji: "思い出", mora: 4, tags: ["empathetic","patient"] },
        { kana: "やくそく", kanji: "約束", mora: 4, tags: ["organized","social"] },
        { kana: "けいかく", kanji: "計画", mora: 4, tags: ["organized","focused"] },
        { kana: "しずけさ", kanji: "静けさ", mora: 4, tags: ["patient","calm"] },
        { kana: "やさしさ", kanji: "優しさ", mora: 4, tags: ["empathetic","calm"] },
        { kana: "しあわせ", kanji: "幸せ", mora: 4, tags: ["lucky","optimistic"] },
        { kana: "うんめい", kanji: "運命", mora: 4, tags: ["lucky","adventurous"] },
        // short phrases 4
        { kana: "このみち", kanji: "この道", mora: 4, tags: ["adventurous","patient"] },
        { kana: "あのそら", kanji: "あの空", mora: 4, tags: ["adventurous","optimistic"] },
        { kana: "このうた", kanji: "この歌", mora: 4, tags: ["expressive","creative"] },
        { kana: "そのこえ", kanji: "その声", mora: 4, tags: ["social","expressive"] },
        { kana: "このまま", kanji: "このまま", mora: 4, tags: ["calm","patient"] },
        { kana: "まっすぐ", kanji: "真っ直ぐ", mora: 4, tags: ["focused","resilient"] },
        { kana: "いきいき", kanji: "生き生き", mora: 4, tags: ["active","optimistic"] },
        { kana: "きらきら", kanji: "きらきら", mora: 4, tags: ["expressive","optimistic"] },
        { kana: "ゆっくり", kanji: "ゆっくり", mora: 4, tags: ["patient","calm"] },
        { kana: "ひとりで", kanji: "一人で", mora: 4, tags: ["focused","resilient"] },
        { kana: "みんなの", kanji: "みんなの", mora: 4, tags: ["social","empathetic"] },
        { kana: "あしたへ", kanji: "明日へ", mora: 4, tags: ["optimistic","adventurous"] },
        { kana: "ひかりの", kanji: "光の", mora: 4, tags: ["optimistic","creative"] },
        { kana: "こころの", kanji: "心の", mora: 4, tags: ["empathetic","focused"] },

        // ===== 5 mora (natural verb/adj phrases) =====
        { kana: "かぜがふく", kanji: "風が吹く", mora: 5, tags: ["adventurous","calm"] },
        { kana: "ゆめをみる", kanji: "夢を見る", mora: 5, tags: ["optimistic","creative"] },
        { kana: "そらをとぶ", kanji: "空を飛ぶ", mora: 5, tags: ["adventurous","active"] },
        { kana: "はながさく", kanji: "花が咲く", mora: 5, tags: ["optimistic","calm"] },
        { kana: "ほしがふる", kanji: "星が降る", mora: 5, tags: ["curious","optimistic"] },
        { kana: "うたをうたう", kanji: "歌を歌う", mora: 5, tags: ["expressive","creative"] },
        { kana: "ひがのぼる", kanji: "陽が昇る", mora: 5, tags: ["optimistic","active"] },
        { kana: "あめがやむ", kanji: "雨が止む", mora: 5, tags: ["patient","optimistic"] },
        { kana: "なみがよせる", kanji: "波が寄せる", mora: 5, tags: ["calm","patient"] },
        { kana: "とびらあける", kanji: "扉開ける", mora: 5, tags: ["adventurous","curious"] },
        // adj + noun
        { kana: "やさしいかぜ", kanji: "優しい風", mora: 5, tags: ["empathetic","calm"] },
        { kana: "あかるいそら", kanji: "明るい空", mora: 5, tags: ["optimistic","active"] },
        { kana: "あたらしいひ", kanji: "新しい日", mora: 5, tags: ["curious","adventurous"] },
        { kana: "ちいさなはな", kanji: "小さな花", mora: 5, tags: ["calm","empathetic"] },
        { kana: "とおいきおく", kanji: "遠い記憶", mora: 5, tags: ["patient","empathetic"] },
        // adv/poetic
        { kana: "どこまでも", kanji: "どこまでも", mora: 5, tags: ["adventurous","resilient"] },
        { kana: "いつまでも", kanji: "いつまでも", mora: 5, tags: ["patient","empathetic"] },
        { kana: "なんどでも", kanji: "何度でも", mora: 5, tags: ["resilient","patient"] },
        { kana: "ここにいる", kanji: "ここにいる", mora: 5, tags: ["focused","calm"] },
        { kana: "そばにいる", kanji: "傍にいる", mora: 5, tags: ["empathetic","social"] },
        // nouns 5
        { kana: "おもいやり", kanji: "思いやり", mora: 5, tags: ["empathetic","social"] },
        { kana: "たからもの", kanji: "宝物", mora: 5, tags: ["lucky","empathetic"] },
        { kana: "もくひょうへ", kanji: "目標へ", mora: 5, tags: ["focused","organized"] },
        { kana: "うつくしい", kanji: "美しい", mora: 5, tags: ["creative","expressive"] },
        { kana: "あたたかい", kanji: "温かい", mora: 5, tags: ["optimistic","empathetic"] },
        { kana: "あたらしい", kanji: "新しい", mora: 5, tags: ["curious","adventurous"] },

        // ===== 6 mora (complete clauses) =====
        { kana: "いつかきっと", kanji: "いつかきっと", mora: 6, tags: ["optimistic","patient"] },
        { kana: "どこにいても", kanji: "どこにいても", mora: 6, tags: ["empathetic","adventurous"] },
        { kana: "えがおのまま", kanji: "笑顔のまま", mora: 6, tags: ["social","optimistic"] },
        { kana: "あきらめない", kanji: "諦めない", mora: 6, tags: ["resilient","patient"] },
        { kana: "ひかりのなか", kanji: "光の中", mora: 6, tags: ["optimistic","creative"] },
        { kana: "こころのおく", kanji: "心の奥", mora: 6, tags: ["empathetic","focused"] },
        { kana: "わすれないで", kanji: "忘れないで", mora: 6, tags: ["empathetic","patient"] },
        { kana: "それでもまだ", kanji: "それでもまだ", mora: 6, tags: ["resilient","patient"] },
        { kana: "かぜにのって", kanji: "風に乗って", mora: 6, tags: ["adventurous","active"] },
        { kana: "ゆめをおって", kanji: "夢を追って", mora: 6, tags: ["optimistic","adventurous"] },
        { kana: "きみがいるから", kanji: "君がいるから", mora: 6, tags: ["social","empathetic"] },
        { kana: "あしたをしんじ", kanji: "明日を信じ", mora: 6, tags: ["optimistic","resilient"] },
        { kana: "このせかいで", kanji: "この世界で", mora: 6, tags: ["adventurous","curious"] },
        { kana: "なみだのあと", kanji: "涙の後", mora: 6, tags: ["empathetic","resilient"] },
        { kana: "てをつないで", kanji: "手を繋いで", mora: 6, tags: ["social","empathetic"] },

        // ===== 7 mora =====
        { kana: "あしたへむかう", kanji: "明日へ向かう", mora: 7, tags: ["optimistic","adventurous"] },
        { kana: "ひかりをあつめ", kanji: "光を集め", mora: 7, tags: ["optimistic","creative"] },
        { kana: "こころにひびく", kanji: "心に響く", mora: 7, tags: ["empathetic","expressive"] },
        { kana: "きみとあるいた", kanji: "君と歩いた", mora: 7, tags: ["social","patient"] },
        { kana: "つよくなれるよ", kanji: "強くなれるよ", mora: 7, tags: ["resilient","active"] },
        { kana: "わらいあえるひ", kanji: "笑い合える日", mora: 7, tags: ["social","optimistic"] },
        { kana: "おわらないゆめ", kanji: "終わらない夢", mora: 7, tags: ["optimistic","resilient"] },

        // ===== 8 mora =====
        { kana: "このみちをあるく", kanji: "この道を歩く", mora: 8, tags: ["adventurous","patient"] },
        { kana: "かぜがうたをはこぶ", kanji: "風が歌を運ぶ", mora: 8, tags: ["adventurous","expressive"] },
        { kana: "ゆめのつづきをみる", kanji: "夢の続きを見る", mora: 8, tags: ["optimistic","creative"] },
        { kana: "いつかまたあえるよ", kanji: "いつかまた会えるよ", mora: 8, tags: ["social","optimistic"] },
        { kana: "こころにともしびを", kanji: "心に灯火を", mora: 8, tags: ["empathetic","optimistic"] },

        // ===== 7 mora (additional complete clauses) =====
        { kana: "ともだちがいる", kanji: "友達がいる", mora: 7, tags: ["social","empathetic"] },
        { kana: "こころがおどる", kanji: "心が踊る", mora: 7, tags: ["expressive","active"] },
        { kana: "みらいをしんじ", kanji: "未来を信じ", mora: 7, tags: ["optimistic","resilient"] },
        { kana: "やさしくなれた", kanji: "優しくなれた", mora: 7, tags: ["empathetic","calm"] },
        { kana: "しあわせだった", kanji: "幸せだった", mora: 7, tags: ["lucky","patient"] },
        { kana: "おもいでのなか", kanji: "思い出の中", mora: 7, tags: ["empathetic","patient"] },

        // ===== 8 mora (additional complete clauses) =====
        { kana: "ここからはじまる", kanji: "ここから始まる", mora: 8, tags: ["adventurous","optimistic"] },
        { kana: "ひとつずつすすむ", kanji: "一つずつ進む", mora: 8, tags: ["patient","focused"] },
        { kana: "みんなでうたおう", kanji: "みんなで歌おう", mora: 8, tags: ["social","expressive"] },
        { kana: "かがやくあしたへ", kanji: "輝く明日へ", mora: 8, tags: ["optimistic","adventurous"] },
        { kana: "やさしいきもちで", kanji: "優しい気持ちで", mora: 8, tags: ["empathetic","calm"] },

        // =============================================
        // ===== 拡張語彙 — 雅語・古語・文語 =====
        // =============================================
        // 2 mora
        { kana: "ふみ", kanji: "文", mora: 2, tags: ["study","creative"] },
        { kana: "まい", kanji: "舞", mora: 2, tags: ["active","creative"] },
        { kana: "えん", kanji: "縁", mora: 2, tags: ["social","empathetic"] },
        { kana: "ふえ", kanji: "笛", mora: 2, tags: ["creative","expressive"] },
        { kana: "こと", kanji: "琴", mora: 2, tags: ["creative","calm"] },
        { kana: "すず", kanji: "鈴", mora: 2, tags: ["creative","calm"] },
        { kana: "みや", kanji: "宮", mora: 2, tags: ["calm","organized"] },
        { kana: "わび", kanji: "侘", mora: 2, tags: ["calm","creative"] },
        { kana: "さび", kanji: "寂", mora: 2, tags: ["calm","patient"] },
        { kana: "のり", kanji: "法", mora: 2, tags: ["organized","focused"] },
        { kana: "ぬし", kanji: "主", mora: 2, tags: ["focused","resilient"] },
        { kana: "そで", kanji: "袖", mora: 2, tags: ["empathetic","calm"] },
        // 3 mora
        { kana: "なごり", kanji: "名残", mora: 3, tags: ["empathetic","patient"] },
        { kana: "えにし", kanji: "縁", mora: 3, tags: ["social","lucky"] },
        { kana: "みやび", kanji: "雅", mora: 3, tags: ["creative","calm"] },
        { kana: "あわれ", kanji: "哀れ", mora: 3, tags: ["empathetic","calm"] },
        { kana: "しのぶ", kanji: "偲ぶ", mora: 3, tags: ["empathetic","patient"] },
        { kana: "ゆかり", kanji: "ゆかり", mora: 3, tags: ["social","empathetic"] },
        { kana: "しるべ", kanji: "導", mora: 3, tags: ["adventurous","focused"] },
        { kana: "かたみ", kanji: "形見", mora: 3, tags: ["empathetic","patient"] },
        { kana: "こずえ", kanji: "梢", mora: 3, tags: ["calm","creative"] },
        { kana: "むすび", kanji: "結び", mora: 3, tags: ["social","empathetic"] },
        { kana: "ほまれ", kanji: "誉れ", mora: 3, tags: ["focused","resilient"] },
        { kana: "みそぎ", kanji: "禊", mora: 3, tags: ["calm","focused"] },
        { kana: "うたげ", kanji: "宴", mora: 3, tags: ["social","active"] },
        { kana: "なさけ", kanji: "情け", mora: 3, tags: ["empathetic","social"] },
        { kana: "いのり", kanji: "祈り", mora: 3, tags: ["patient","empathetic"] },
        { kana: "まつり", kanji: "祭", mora: 3, tags: ["active","social"] },
        { kana: "あかし", kanji: "証", mora: 3, tags: ["focused","resilient"] },
        { kana: "たもと", kanji: "袂", mora: 3, tags: ["empathetic","adventurous"] },
        { kana: "よすが", kanji: "縁", mora: 3, tags: ["social","empathetic"] },
        { kana: "おきな", kanji: "翁", mora: 3, tags: ["patient","calm"] },
        { kana: "つづみ", kanji: "鼓", mora: 3, tags: ["active","creative"] },
        { kana: "かざし", kanji: "挿頭", mora: 3, tags: ["creative","calm"] },
        { kana: "あやめ", kanji: "菖蒲", mora: 3, tags: ["calm","creative"] },
        { kana: "ねいろ", kanji: "音色", mora: 3, tags: ["creative","expressive"] },
        // 4 mora
        { kana: "いにしえ", kanji: "古", mora: 4, tags: ["patient","calm"] },
        { kana: "おもかげ", kanji: "面影", mora: 4, tags: ["empathetic","patient"] },
        { kana: "たそがれ", kanji: "黄昏", mora: 4, tags: ["calm","patient"] },
        { kana: "うたかた", kanji: "泡沫", mora: 4, tags: ["calm","patient"] },
        { kana: "たまゆら", kanji: "玉響", mora: 4, tags: ["calm","curious"] },
        { kana: "しののめ", kanji: "東雲", mora: 4, tags: ["optimistic","calm"] },
        { kana: "かげろう", kanji: "陽炎", mora: 4, tags: ["calm","curious"] },
        { kana: "こもれび", kanji: "木漏れ日", mora: 4, tags: ["calm","optimistic"] },
        { kana: "つきかげ", kanji: "月影", mora: 4, tags: ["calm","creative"] },
        { kana: "かがりび", kanji: "篝火", mora: 4, tags: ["calm","resilient"] },
        { kana: "しらつゆ", kanji: "白露", mora: 4, tags: ["calm","patient"] },
        { kana: "はなびら", kanji: "花びら", mora: 4, tags: ["calm","creative"] },
        { kana: "うつろい", kanji: "移ろい", mora: 4, tags: ["patient","calm"] },
        { kana: "ことのは", kanji: "言の葉", mora: 4, tags: ["creative","expressive"] },
        { kana: "せいそう", kanji: "星霜", mora: 4, tags: ["patient","calm"] },
        { kana: "かざはな", kanji: "風花", mora: 4, tags: ["calm","creative"] },
        { kana: "ゆうづる", kanji: "夕鶴", mora: 4, tags: ["calm","empathetic"] },
        { kana: "おもむき", kanji: "趣", mora: 4, tags: ["creative","calm"] },
        { kana: "すがたみ", kanji: "姿見", mora: 4, tags: ["curious","creative"] },
        { kana: "あまぐも", kanji: "雨雲", mora: 4, tags: ["calm","patient"] },
        { kana: "あけぼの", kanji: "曙", mora: 4, tags: ["optimistic","calm"] },
        // 5 mora
        { kana: "はないかだ", kanji: "花筏", mora: 5, tags: ["calm","creative"] },
        { kana: "ものがたり", kanji: "物語", mora: 5, tags: ["creative","study"] },
        { kana: "あまつかぜ", kanji: "天つ風", mora: 5, tags: ["adventurous","calm"] },
        { kana: "ゆめまくら", kanji: "夢枕", mora: 5, tags: ["creative","calm"] },
        { kana: "みをつくし", kanji: "澪標", mora: 5, tags: ["adventurous","patient"] },
        { kana: "はなのした", kanji: "花の下", mora: 5, tags: ["calm","optimistic"] },
        { kana: "ゆめうつつ", kanji: "夢現", mora: 5, tags: ["creative","calm"] },
        { kana: "ちぎりをむすぶ", kanji: "契りを結ぶ", mora: 7, tags: ["social","empathetic"] },
        // 6 mora
        { kana: "いちごいちえ", kanji: "一期一会", mora: 6, tags: ["social","patient"] },
        { kana: "えんをむすぶ", kanji: "縁を結ぶ", mora: 6, tags: ["social","empathetic"] },
        { kana: "はなにあらし", kanji: "花に嵐", mora: 6, tags: ["calm","resilient"] },
        { kana: "うつろいゆく", kanji: "移ろいゆく", mora: 6, tags: ["patient","calm"] },
        { kana: "みちをてらす", kanji: "道を照らす", mora: 6, tags: ["optimistic","focused"] },
        { kana: "ひとよのゆめ", kanji: "一夜の夢", mora: 6, tags: ["calm","patient"] },
        { kana: "こころざしの", kanji: "志の", mora: 6, tags: ["focused","resilient"] },
        { kana: "おもいをこめ", kanji: "想いを込め", mora: 6, tags: ["empathetic","focused"] },
        // 7 mora
        { kana: "たもとをわかつ", kanji: "袂を分かつ", mora: 7, tags: ["adventurous","resilient"] },
        { kana: "かちょうふうげつ", kanji: "花鳥風月", mora: 7, tags: ["creative","calm"] },
        { kana: "よすがをもとめ", kanji: "縁を求め", mora: 7, tags: ["social","adventurous"] },
        { kana: "ゆめのうきはし", kanji: "夢の浮橋", mora: 7, tags: ["creative","calm"] },
        { kana: "いろはにほへと", kanji: "いろはにほへと", mora: 7, tags: ["study","creative"] },
        { kana: "つきにむらくも", kanji: "月に叢雲", mora: 7, tags: ["calm","patient"] },
        { kana: "こころにきざむ", kanji: "心に刻む", mora: 7, tags: ["empathetic","focused"] },
        // 8 mora
        { kana: "おもいをはせるひ", kanji: "思いを馳せる日", mora: 8, tags: ["empathetic","patient"] },
        { kana: "えんはいなもの", kanji: "縁は異なもの", mora: 7, tags: ["lucky","social"] },
        { kana: "よすがをもとめて", kanji: "縁を求めて", mora: 8, tags: ["social","adventurous"] },
        { kana: "いにしえをしのぶ", kanji: "古を偲ぶ", mora: 8, tags: ["patient","empathetic"] },
        { kana: "ゆくかわのながれ", kanji: "行く川の流れ", mora: 8, tags: ["patient","calm"] },

        // =============================================
        // ===== 拡張語彙 — 自然・風景・季節 =====
        // =============================================
        // 2 mora
        { kana: "やま", kanji: "山", mora: 2, tags: ["adventurous","active"] },
        { kana: "かわ", kanji: "川", mora: 2, tags: ["calm","patient"] },
        { kana: "ゆき", kanji: "雪", mora: 2, tags: ["calm","patient"] },
        { kana: "くさ", kanji: "草", mora: 2, tags: ["calm","patient"] },
        { kana: "たけ", kanji: "竹", mora: 2, tags: ["resilient","patient"] },
        { kana: "まつ", kanji: "松", mora: 2, tags: ["patient","resilient"] },
        { kana: "いし", kanji: "石", mora: 2, tags: ["resilient","patient"] },
        { kana: "しま", kanji: "島", mora: 2, tags: ["adventurous","calm"] },
        { kana: "きり", kanji: "霧", mora: 2, tags: ["calm","curious"] },
        { kana: "つゆ", kanji: "露", mora: 2, tags: ["calm","patient"] },
        { kana: "たに", kanji: "谷", mora: 2, tags: ["calm","adventurous"] },
        { kana: "おか", kanji: "丘", mora: 2, tags: ["calm","adventurous"] },
        { kana: "さと", kanji: "里", mora: 2, tags: ["calm","social"] },
        { kana: "みね", kanji: "峰", mora: 2, tags: ["adventurous","resilient"] },
        { kana: "ふね", kanji: "舟", mora: 2, tags: ["adventurous","calm"] },
        { kana: "にわ", kanji: "庭", mora: 2, tags: ["calm","creative"] },
        { kana: "つた", kanji: "蔦", mora: 2, tags: ["calm","patient"] },
        { kana: "うめ", kanji: "梅", mora: 2, tags: ["patient","calm"] },
        { kana: "きく", kanji: "菊", mora: 2, tags: ["calm","patient"] },
        { kana: "ふじ", kanji: "藤", mora: 2, tags: ["calm","creative"] },
        { kana: "はぎ", kanji: "萩", mora: 2, tags: ["calm","patient"] },
        { kana: "すぎ", kanji: "杉", mora: 2, tags: ["resilient","patient"] },
        { kana: "いね", kanji: "稲", mora: 2, tags: ["patient","calm"] },
        { kana: "もも", kanji: "桃", mora: 2, tags: ["optimistic","calm"] },
        { kana: "いと", kanji: "糸", mora: 2, tags: ["creative","patient"] },
        { kana: "みず", kanji: "水", mora: 2, tags: ["calm","patient"] },
        { kana: "ひび", kanji: "日々", mora: 2, tags: ["patient","calm"] },
        { kana: "つる", kanji: "鶴", mora: 2, tags: ["calm","creative"] },
        { kana: "けさ", kanji: "今朝", mora: 2, tags: ["optimistic","active"] },
        { kana: "ゆう", kanji: "夕", mora: 2, tags: ["calm","patient"] },
        { kana: "やみ", kanji: "闇", mora: 2, tags: ["calm","patient"] },
        // 3 mora
        { kana: "さくら", kanji: "桜", mora: 3, tags: ["optimistic","calm"] },
        { kana: "すみれ", kanji: "菫", mora: 3, tags: ["calm","creative"] },
        { kana: "はやし", kanji: "林", mora: 3, tags: ["calm","patient"] },
        { kana: "あらし", kanji: "嵐", mora: 3, tags: ["active","adventurous"] },
        { kana: "みなと", kanji: "港", mora: 3, tags: ["adventurous","calm"] },
        { kana: "こだま", kanji: "木霊", mora: 3, tags: ["calm","curious"] },
        { kana: "いずみ", kanji: "泉", mora: 3, tags: ["calm","optimistic"] },
        { kana: "ほたる", kanji: "蛍", mora: 3, tags: ["calm","creative"] },
        { kana: "みのり", kanji: "実り", mora: 3, tags: ["patient","optimistic"] },
        { kana: "おぼろ", kanji: "朧", mora: 3, tags: ["calm","creative"] },
        { kana: "しぐれ", kanji: "時雨", mora: 3, tags: ["calm","patient"] },
        { kana: "つぼみ", kanji: "蕾", mora: 3, tags: ["optimistic","patient"] },
        { kana: "かすみ", kanji: "霞", mora: 3, tags: ["calm","creative"] },
        { kana: "あかね", kanji: "茜", mora: 3, tags: ["calm","creative"] },
        { kana: "こだち", kanji: "木立", mora: 3, tags: ["calm","patient"] },
        { kana: "わたり", kanji: "渡り", mora: 3, tags: ["adventurous","patient"] },
        { kana: "めぶき", kanji: "芽吹き", mora: 3, tags: ["optimistic","patient"] },
        { kana: "こがね", kanji: "黄金", mora: 3, tags: ["lucky","creative"] },
        { kana: "あかり", kanji: "灯り", mora: 3, tags: ["optimistic","calm"] },
        { kana: "たびじ", kanji: "旅路", mora: 3, tags: ["adventurous","patient"] },
        { kana: "ゆうべ", kanji: "夕べ", mora: 3, tags: ["calm","patient"] },
        { kana: "こよい", kanji: "今宵", mora: 3, tags: ["calm","social"] },
        { kana: "のはら", kanji: "野原", mora: 3, tags: ["calm","adventurous"] },
        { kana: "あした", kanji: "明日", mora: 3, tags: ["optimistic","adventurous"] },
        { kana: "おがわ", kanji: "小川", mora: 3, tags: ["calm","patient"] },
        { kana: "すなお", kanji: "素直", mora: 3, tags: ["empathetic","calm"] },
        // 4 mora
        { kana: "ささなみ", kanji: "漣", mora: 4, tags: ["calm","patient"] },
        { kana: "ゆきどけ", kanji: "雪解け", mora: 4, tags: ["optimistic","patient"] },
        { kana: "はなぞの", kanji: "花園", mora: 4, tags: ["calm","creative"] },
        { kana: "やまみち", kanji: "山道", mora: 4, tags: ["adventurous","patient"] },
        { kana: "うみかぜ", kanji: "海風", mora: 4, tags: ["adventurous","calm"] },
        { kana: "あきぞら", kanji: "秋空", mora: 4, tags: ["calm","creative"] },
        { kana: "なつぐさ", kanji: "夏草", mora: 4, tags: ["calm","patient"] },
        { kana: "はるかぜ", kanji: "春風", mora: 4, tags: ["optimistic","calm"] },
        { kana: "ゆうやけ", kanji: "夕焼け", mora: 4, tags: ["calm","creative"] },
        { kana: "あさつゆ", kanji: "朝露", mora: 4, tags: ["calm","optimistic"] },
        { kana: "よぞらに", kanji: "夜空に", mora: 4, tags: ["calm","curious"] },
        { kana: "しおかぜ", kanji: "潮風", mora: 4, tags: ["adventurous","calm"] },
        { kana: "まちなみ", kanji: "街並み", mora: 4, tags: ["social","calm"] },
        // 5 mora
        { kana: "やまざくら", kanji: "山桜", mora: 5, tags: ["calm","adventurous"] },
        { kana: "あまのがわ", kanji: "天の川", mora: 5, tags: ["curious","creative"] },
        { kana: "しらなみの", kanji: "白波の", mora: 5, tags: ["calm","adventurous"] },
        { kana: "つきあかり", kanji: "月明かり", mora: 5, tags: ["calm","creative"] },
        { kana: "はなふぶき", kanji: "花吹雪", mora: 5, tags: ["creative","calm"] },
        { kana: "もみじばの", kanji: "紅葉葉の", mora: 5, tags: ["calm","creative"] },
        { kana: "ゆきげしき", kanji: "雪景色", mora: 5, tags: ["calm","creative"] },
        { kana: "あさひがさす", kanji: "朝日が差す", mora: 6, tags: ["optimistic","active"] },
        // 6 mora
        { kana: "さくらちるひ", kanji: "桜散る日", mora: 6, tags: ["calm","patient"] },
        { kana: "ほたるのひかり", kanji: "蛍の光", mora: 7, tags: ["calm","creative"] },
        { kana: "かわのながれに", kanji: "川の流れに", mora: 7, tags: ["calm","patient"] },
        { kana: "つきがてらす", kanji: "月が照らす", mora: 6, tags: ["calm","optimistic"] },
        { kana: "はなにうたう", kanji: "花に歌う", mora: 6, tags: ["creative","expressive"] },
        { kana: "あめあがりの", kanji: "雨上がりの", mora: 6, tags: ["optimistic","calm"] },
        { kana: "そよかぜがふく", kanji: "そよ風が吹く", mora: 7, tags: ["calm","adventurous"] },
        // 8 mora
        { kana: "ゆうやけそまるそら", kanji: "夕焼け染まる空", mora: 8, tags: ["calm","creative"] },
        { kana: "はなびらがまうころ", kanji: "花びらが舞う頃", mora: 8, tags: ["calm","creative"] },

        // =============================================
        // ===== 拡張語彙 — 感情・心象・内面 =====
        // =============================================
        // 2 mora
        { kana: "こい", kanji: "恋", mora: 2, tags: ["empathetic","social"] },
        { kana: "きず", kanji: "傷", mora: 2, tags: ["empathetic","resilient"] },
        { kana: "むね", kanji: "胸", mora: 2, tags: ["empathetic","expressive"] },
        { kana: "かげ", kanji: "影", mora: 2, tags: ["calm","curious"] },
        { kana: "いき", kanji: "息", mora: 2, tags: ["calm","patient"] },
        { kana: "なぞ", kanji: "謎", mora: 2, tags: ["curious","creative"] },
        { kana: "わざ", kanji: "技", mora: 2, tags: ["creative","focused"] },
        { kana: "ゆめ", kanji: "夢", mora: 2, tags: ["optimistic","creative"] },
        { kana: "かぎ", kanji: "鍵", mora: 2, tags: ["curious","focused"] },
        { kana: "ふで", kanji: "筆", mora: 2, tags: ["creative","expressive"] },
        // 3 mora
        { kana: "すがた", kanji: "姿", mora: 3, tags: ["creative","calm"] },
        { kana: "のぞみ", kanji: "望み", mora: 3, tags: ["optimistic","focused"] },
        { kana: "ほこり", kanji: "誇り", mora: 3, tags: ["focused","resilient"] },
        { kana: "まよい", kanji: "迷い", mora: 3, tags: ["curious","cautious"] },
        { kana: "いたみ", kanji: "痛み", mora: 3, tags: ["empathetic","resilient"] },
        { kana: "ぬくみ", kanji: "温み", mora: 3, tags: ["empathetic","calm"] },
        { kana: "あこがれ", kanji: "憧れ", mora: 4, tags: ["adventurous","optimistic"] },
        { kana: "ねがい", kanji: "願い", mora: 3, tags: ["optimistic","empathetic"] },
        { kana: "おもい", kanji: "想い", mora: 3, tags: ["empathetic","creative"] },
        { kana: "あじわい", kanji: "味わい", mora: 4, tags: ["calm","creative"] },
        { kana: "よろこび", kanji: "喜び", mora: 4, tags: ["optimistic","social"] },
        { kana: "かなしみ", kanji: "悲しみ", mora: 4, tags: ["empathetic","patient"] },
        { kana: "いとしさ", kanji: "愛しさ", mora: 4, tags: ["empathetic","social"] },
        { kana: "せつなさ", kanji: "切なさ", mora: 4, tags: ["empathetic","calm"] },
        { kana: "はかなさ", kanji: "儚さ", mora: 4, tags: ["calm","patient"] },
        { kana: "たくましさ", kanji: "逞しさ", mora: 5, tags: ["resilient","active"] },
        { kana: "いとおしい", kanji: "愛おしい", mora: 5, tags: ["empathetic","social"] },
        { kana: "なつかしい", kanji: "懐かしい", mora: 5, tags: ["empathetic","patient"] },
        { kana: "はかない", kanji: "儚い", mora: 4, tags: ["calm","patient"] },
        { kana: "いじらしい", kanji: "いじらしい", mora: 5, tags: ["empathetic","calm"] },
        { kana: "たおやかな", kanji: "嫋やかな", mora: 5, tags: ["calm","creative"] },
        // verbs — emotion
        { kana: "ねがう", kanji: "願う", mora: 3, tags: ["optimistic","empathetic"] },
        { kana: "いだく", kanji: "抱く", mora: 3, tags: ["empathetic","active"] },
        { kana: "つむぐ", kanji: "紡ぐ", mora: 3, tags: ["creative","patient"] },
        { kana: "めぐる", kanji: "巡る", mora: 3, tags: ["adventurous","curious"] },
        { kana: "やどる", kanji: "宿る", mora: 3, tags: ["calm","patient"] },
        { kana: "かたる", kanji: "語る", mora: 3, tags: ["expressive","social"] },
        { kana: "いわう", kanji: "祝う", mora: 3, tags: ["social","optimistic"] },
        { kana: "きざむ", kanji: "刻む", mora: 3, tags: ["focused","patient"] },
        { kana: "あおぐ", kanji: "仰ぐ", mora: 3, tags: ["optimistic","curious"] },
        { kana: "かよう", kanji: "通う", mora: 3, tags: ["patient","social"] },
        { kana: "ゆれる", kanji: "揺れる", mora: 3, tags: ["calm","empathetic"] },
        { kana: "あふれ", kanji: "溢れ", mora: 3, tags: ["expressive","active"] },
        { kana: "なびく", kanji: "靡く", mora: 3, tags: ["calm","adventurous"] },
        { kana: "そよぐ", kanji: "そよぐ", mora: 3, tags: ["calm","creative"] },
        { kana: "ゆるす", kanji: "赦す", mora: 3, tags: ["empathetic","patient"] },
        // 4 mora verbs
        { kana: "ときめく", kanji: "ときめく", mora: 4, tags: ["optimistic","social"] },
        { kana: "ふりかえる", kanji: "振り返る", mora: 5, tags: ["patient","empathetic"] },
        { kana: "たちあがる", kanji: "立ち上がる", mora: 5, tags: ["resilient","active"] },
        { kana: "うけとめる", kanji: "受け止める", mora: 5, tags: ["resilient","empathetic"] },
        { kana: "おもいだす", kanji: "思い出す", mora: 5, tags: ["empathetic","patient"] },
        { kana: "たどりつく", kanji: "辿り着く", mora: 5, tags: ["adventurous","resilient"] },
        { kana: "はぐくむ", kanji: "育む", mora: 4, tags: ["empathetic","patient"] },
        { kana: "いたわる", kanji: "労る", mora: 4, tags: ["empathetic","calm"] },
        { kana: "ふれあう", kanji: "触れ合う", mora: 4, tags: ["social","empathetic"] },
        { kana: "まちわびる", kanji: "待ち侘びる", mora: 5, tags: ["patient","empathetic"] },
        // 5-6 mora phrases — emotion
        { kana: "こころがゆれる", kanji: "心が揺れる", mora: 7, tags: ["empathetic","calm"] },
        { kana: "なみだをぬぐう", kanji: "涙を拭う", mora: 7, tags: ["empathetic","resilient"] },
        { kana: "むねにしまう", kanji: "胸にしまう", mora: 6, tags: ["empathetic","patient"] },
        { kana: "こいしくて", kanji: "恋しくて", mora: 5, tags: ["empathetic","social"] },
        { kana: "おもいはつきず", kanji: "思いは尽きず", mora: 7, tags: ["empathetic","resilient"] },
        { kana: "むねがあつくなる", kanji: "胸が熱くなる", mora: 8, tags: ["empathetic","expressive"] },

        // =============================================
        // ===== 拡張語彙 — 人・絆・社会 =====
        // =============================================
        // 2 mora
        { kana: "ひと", kanji: "人", mora: 2, tags: ["social","empathetic"] },
        { kana: "おや", kanji: "親", mora: 2, tags: ["empathetic","patient"] },
        { kana: "こら", kanji: "子ら", mora: 2, tags: ["social","empathetic"] },
        { kana: "とも", kanji: "友", mora: 2, tags: ["social","empathetic"] },
        // 3 mora
        { kana: "かぞく", kanji: "家族", mora: 3, tags: ["social","empathetic"] },
        { kana: "きょうだい", kanji: "兄弟", mora: 4, tags: ["social","empathetic"] },
        { kana: "ふるさと", kanji: "故郷", mora: 4, tags: ["empathetic","calm"] },
        { kana: "となり", kanji: "隣", mora: 3, tags: ["social","calm"] },
        { kana: "むかし", kanji: "昔", mora: 3, tags: ["patient","empathetic"] },
        { kana: "あいする", kanji: "愛する", mora: 4, tags: ["empathetic","social"] },
        { kana: "であい", kanji: "出会い", mora: 3, tags: ["social","lucky"] },
        { kana: "わかれ", kanji: "別れ", mora: 3, tags: ["empathetic","patient"] },
        { kana: "ちかい", kanji: "誓い", mora: 3, tags: ["focused","social"] },
        // 4 mora
        { kana: "てをとる", kanji: "手を取る", mora: 4, tags: ["social","empathetic"] },
        { kana: "かたをならべ", kanji: "肩を並べ", mora: 6, tags: ["social","active"] },
        { kana: "ちぎりの", kanji: "契りの", mora: 4, tags: ["social","empathetic"] },
        { kana: "ふたりの", kanji: "二人の", mora: 4, tags: ["social","empathetic"] },
        { kana: "まなざし", kanji: "眼差し", mora: 4, tags: ["empathetic","focused"] },
        // 5-6 mora
        { kana: "てをふりあい", kanji: "手を振り合い", mora: 6, tags: ["social","optimistic"] },
        { kana: "あなたがいて", kanji: "あなたがいて", mora: 6, tags: ["social","empathetic"] },
        { kana: "みちづれの", kanji: "道連れの", mora: 5, tags: ["social","adventurous"] },
        { kana: "ささえあって", kanji: "支え合って", mora: 6, tags: ["social","empathetic"] },
        { kana: "ふたりであるく", kanji: "二人で歩く", mora: 7, tags: ["social","patient"] },
        { kana: "であえたことに", kanji: "出会えたことに", mora: 7, tags: ["social","lucky"] },
        { kana: "きみをおもう", kanji: "君を想う", mora: 6, tags: ["empathetic","social"] },

        // =============================================
        // ===== 拡張語彙 — 行動・意志・成長 =====
        // =============================================
        // 2-3 mora
        { kana: "とぶ", kanji: "飛ぶ", mora: 2, tags: ["adventurous","active"] },
        { kana: "はしる", kanji: "走る", mora: 3, tags: ["active","adventurous"] },
        { kana: "のぼる", kanji: "登る", mora: 3, tags: ["adventurous","resilient"] },
        { kana: "こえる", kanji: "超える", mora: 3, tags: ["resilient","adventurous"] },
        { kana: "むかう", kanji: "向かう", mora: 3, tags: ["adventurous","focused"] },
        { kana: "つかむ", kanji: "掴む", mora: 3, tags: ["active","focused"] },
        { kana: "きわめる", kanji: "極める", mora: 4, tags: ["focused","resilient"] },
        { kana: "いどむ", kanji: "挑む", mora: 3, tags: ["adventurous","resilient"] },
        { kana: "たたかう", kanji: "戦う", mora: 4, tags: ["resilient","active"] },
        { kana: "みがく", kanji: "磨く", mora: 3, tags: ["focused","study"] },
        { kana: "はげむ", kanji: "励む", mora: 3, tags: ["focused","resilient"] },
        { kana: "きたえる", kanji: "鍛える", mora: 4, tags: ["resilient","focused"] },
        { kana: "あゆむ", kanji: "歩む", mora: 3, tags: ["patient","adventurous"] },
        { kana: "ささげる", kanji: "捧げる", mora: 4, tags: ["empathetic","focused"] },
        { kana: "つらぬく", kanji: "貫く", mora: 4, tags: ["resilient","focused"] },
        { kana: "そだてる", kanji: "育てる", mora: 4, tags: ["patient","empathetic"] },
        { kana: "おこす", kanji: "起こす", mora: 3, tags: ["active","resilient"] },
        { kana: "めざす", kanji: "目指す", mora: 3, tags: ["focused","adventurous"] },
        { kana: "えらぶ", kanji: "選ぶ", mora: 3, tags: ["focused","cautious"] },
        { kana: "まなざし", kanji: "眼差し", mora: 4, tags: ["focused","empathetic"] },
        // 4-5 mora
        { kana: "ちからづよい", kanji: "力強い", mora: 6, tags: ["resilient","active"] },
        { kana: "しっかりと", kanji: "しっかりと", mora: 5, tags: ["focused","resilient"] },
        { kana: "あるきだす", kanji: "歩き出す", mora: 5, tags: ["adventurous","active"] },
        { kana: "とびたつ", kanji: "飛び立つ", mora: 4, tags: ["adventurous","active"] },
        { kana: "ふみだす", kanji: "踏み出す", mora: 4, tags: ["adventurous","resilient"] },
        { kana: "きりひらく", kanji: "切り拓く", mora: 5, tags: ["adventurous","resilient"] },
        { kana: "おいかける", kanji: "追いかける", mora: 5, tags: ["active","adventurous"] },
        // 6-7 mora
        { kana: "あきらめずに", kanji: "諦めずに", mora: 6, tags: ["resilient","patient"] },
        { kana: "まえをむいて", kanji: "前を向いて", mora: 6, tags: ["optimistic","resilient"] },
        { kana: "いっぽずつ", kanji: "一歩ずつ", mora: 5, tags: ["patient","focused"] },
        { kana: "ゆめにむかって", kanji: "夢に向かって", mora: 7, tags: ["optimistic","adventurous"] },
        { kana: "じぶんらしく", kanji: "自分らしく", mora: 6, tags: ["focused","resilient"] },
        { kana: "あしあとをのこす", kanji: "足跡を残す", mora: 8, tags: ["patient","focused"] },
        { kana: "つよくあれ", kanji: "強くあれ", mora: 5, tags: ["resilient","active"] },
        { kana: "たちどまらず", kanji: "立ち止まらず", mora: 6, tags: ["adventurous","resilient"] },

        // =============================================
        // ===== 拡張語彙 — 人生・時間・記憶 =====
        // =============================================
        // 2-3 mora
        { kana: "とき", kanji: "時", mora: 2, tags: ["patient","calm"] },
        { kana: "いま", kanji: "今", mora: 2, tags: ["focused","active"] },
        { kana: "むかし", kanji: "昔", mora: 3, tags: ["patient","empathetic"] },
        { kana: "あす", kanji: "明日", mora: 2, tags: ["optimistic","adventurous"] },
        { kana: "きのう", kanji: "昨日", mora: 3, tags: ["patient","empathetic"] },
        { kana: "いつか", kanji: "いつか", mora: 3, tags: ["optimistic","patient"] },
        { kana: "これから", kanji: "これから", mora: 4, tags: ["optimistic","adventurous"] },
        { kana: "おわり", kanji: "終わり", mora: 3, tags: ["patient","calm"] },
        { kana: "さいご", kanji: "最後", mora: 3, tags: ["patient","focused"] },
        { kana: "きせき", kanji: "軌跡", mora: 3, tags: ["adventurous","patient"] },
        { kana: "あゆみ", kanji: "歩み", mora: 3, tags: ["patient","adventurous"] },
        { kana: "めぐりあい", kanji: "巡り会い", mora: 5, tags: ["social","lucky"] },
        // 4-5 mora
        { kana: "じんせいの", kanji: "人生の", mora: 5, tags: ["patient","adventurous"] },
        { kana: "としつきが", kanji: "年月が", mora: 5, tags: ["patient","calm"] },
        { kana: "すぎゆくひ", kanji: "過ぎゆく日", mora: 5, tags: ["patient","calm"] },
        { kana: "おもいでの", kanji: "思い出の", mora: 5, tags: ["empathetic","patient"] },
        { kana: "つみかさね", kanji: "積み重ね", mora: 5, tags: ["patient","focused"] },
        { kana: "わすれえぬ", kanji: "忘れ得ぬ", mora: 5, tags: ["empathetic","patient"] },
        // 6-8 mora
        { kana: "ときがながれ", kanji: "時が流れ", mora: 6, tags: ["patient","calm"] },
        { kana: "あのひをおもう", kanji: "あの日を思う", mora: 7, tags: ["empathetic","patient"] },
        { kana: "つきひがめぐる", kanji: "月日が巡る", mora: 7, tags: ["patient","calm"] },
        { kana: "すぎたひびは", kanji: "過ぎた日々は", mora: 6, tags: ["patient","empathetic"] },
        { kana: "あのころのゆめ", kanji: "あの頃の夢", mora: 7, tags: ["empathetic","optimistic"] },
        { kana: "きょうもあしたも", kanji: "今日も明日も", mora: 7, tags: ["patient","optimistic"] },
        { kana: "かけがえのない", kanji: "かけがえのない", mora: 7, tags: ["empathetic","lucky"] },
        { kana: "ひとつひとつが", kanji: "一つ一つが", mora: 7, tags: ["patient","focused"] },

        // =============================================
        // ===== 拡張語彙 — 詩的表現・フレーズ =====
        // =============================================
        // fillers / exclamations
        { kana: "いざ", kanji: "いざ", mora: 2, tags: ["active","adventurous"] },
        { kana: "でも", kanji: "でも", mora: 2, tags: ["resilient","patient"] },
        { kana: "ただ", kanji: "ただ", mora: 2, tags: ["calm","focused"] },
        { kana: "えい", kanji: "えい", mora: 2, tags: ["active","resilient"] },
        { kana: "まあ", kanji: "まあ", mora: 2, tags: ["calm","patient"] },
        { kana: "なあ", kanji: "なあ", mora: 2, tags: ["calm","social"] },
        { kana: "ルルル", kanji: "ルルル", mora: 3, tags: ["expressive","creative"] },
        { kana: "ラーラ", kanji: "ラーラ", mora: 3, tags: ["expressive","optimistic"] },
        // onomatopoeia
        { kana: "さらさら", kanji: "さらさら", mora: 4, tags: ["calm","creative"] },
        { kana: "ゆらゆら", kanji: "ゆらゆら", mora: 4, tags: ["calm","creative"] },
        { kana: "ひらひら", kanji: "ひらひら", mora: 4, tags: ["calm","creative"] },
        { kana: "ぽつりぽつり", kanji: "ぽつりぽつり", mora: 6, tags: ["calm","patient"] },
        { kana: "しんしんと", kanji: "しんしんと", mora: 5, tags: ["calm","patient"] },
        { kana: "きらりと", kanji: "きらりと", mora: 4, tags: ["optimistic","creative"] },
        { kana: "ふわりと", kanji: "ふわりと", mora: 4, tags: ["calm","creative"] },
        { kana: "そろりと", kanji: "そろりと", mora: 4, tags: ["cautious","calm"] },
        { kana: "はらはらと", kanji: "はらはらと", mora: 5, tags: ["calm","empathetic"] },
        // adj/adv modifiers
        { kana: "しずかに", kanji: "静かに", mora: 4, tags: ["calm","patient"] },
        { kana: "はるかな", kanji: "遥かな", mora: 4, tags: ["adventurous","optimistic"] },
        { kana: "かすかな", kanji: "微かな", mora: 4, tags: ["calm","cautious"] },
        { kana: "たしかな", kanji: "確かな", mora: 4, tags: ["focused","resilient"] },
        { kana: "おおきな", kanji: "大きな", mora: 4, tags: ["active","adventurous"] },
        { kana: "ちいさな", kanji: "小さな", mora: 4, tags: ["calm","empathetic"] },
        { kana: "あたらしき", kanji: "新しき", mora: 5, tags: ["curious","adventurous"] },
        { kana: "いとしき", kanji: "愛しき", mora: 4, tags: ["empathetic","social"] },
        { kana: "ゆるやかに", kanji: "緩やかに", mora: 5, tags: ["calm","patient"] },
        { kana: "おだやかに", kanji: "穏やかに", mora: 5, tags: ["calm","patient"] },
        { kana: "いにしえの", kanji: "古の", mora: 5, tags: ["patient","calm"] },
        { kana: "かぎりなく", kanji: "限りなく", mora: 5, tags: ["adventurous","resilient"] },
        { kana: "ひとひらの", kanji: "一片の", mora: 5, tags: ["calm","patient"] },
        // complete poetic phrases 6-8
        { kana: "みちはつづく", kanji: "道は続く", mora: 6, tags: ["adventurous","patient"] },
        { kana: "あしたがくる", kanji: "明日が来る", mora: 6, tags: ["optimistic","patient"] },
        { kana: "そらにえがく", kanji: "空に描く", mora: 6, tags: ["creative","adventurous"] },
        { kana: "かぜをきって", kanji: "風を切って", mora: 6, tags: ["adventurous","active"] },
        { kana: "ともにあるく", kanji: "共に歩く", mora: 6, tags: ["social","patient"] },
        { kana: "こころをひらく", kanji: "心を開く", mora: 7, tags: ["empathetic","social"] },
        { kana: "あいをしるとき", kanji: "愛を知る時", mora: 7, tags: ["empathetic","social"] },
        { kana: "ゆめのつづきへ", kanji: "夢の続きへ", mora: 7, tags: ["optimistic","adventurous"] },
        { kana: "ひとりじゃない", kanji: "一人じゃない", mora: 7, tags: ["social","resilient"] },
        { kana: "ここがはじまり", kanji: "ここが始まり", mora: 7, tags: ["optimistic","adventurous"] },
        { kana: "ひかりがみちる", kanji: "光が満ちる", mora: 7, tags: ["optimistic","creative"] },
        { kana: "ゆめをかたろう", kanji: "夢を語ろう", mora: 7, tags: ["optimistic","social"] },
        { kana: "このてでつかむ", kanji: "この手で掴む", mora: 7, tags: ["active","focused"] },
        { kana: "おもいはとどく", kanji: "思いは届く", mora: 7, tags: ["empathetic","optimistic"] },
        { kana: "なにもおそれず", kanji: "何も恐れず", mora: 7, tags: ["resilient","adventurous"] },
        { kana: "ながれるくもの", kanji: "流れる雲の", mora: 7, tags: ["calm","adventurous"] },
        { kana: "きみのえがおが", kanji: "君の笑顔が", mora: 7, tags: ["social","optimistic"] },
        // 8 mora poetic
        { kana: "このせかいにうまれ", kanji: "この世界に生まれ", mora: 8, tags: ["optimistic","adventurous"] },
        { kana: "ひかりのなかへゆく", kanji: "光の中へゆく", mora: 8, tags: ["optimistic","adventurous"] },
        { kana: "こころのままにゆく", kanji: "心のままにゆく", mora: 8, tags: ["focused","adventurous"] },
        { kana: "わすれないこのうた", kanji: "忘れないこの歌", mora: 8, tags: ["empathetic","creative"] },
        { kana: "めをとじればそこに", kanji: "目を閉じればそこに", mora: 8, tags: ["empathetic","patient"] },
        { kana: "あのひのやくそくを", kanji: "あの日の約束を", mora: 8, tags: ["empathetic","social"] },
        { kana: "ありがとうのことば", kanji: "ありがとうの言葉", mora: 8, tags: ["empathetic","social"] },
        { kana: "いのちがかがやく", kanji: "命が輝く", mora: 8, tags: ["resilient","optimistic"] },
        { kana: "ふるさとをおもう", kanji: "故郷を想う", mora: 8, tags: ["empathetic","calm"] },

        // =============================================
        // ===== 拡張語彙 — 学び・好奇心・創造 =====
        // =============================================
        // 2-3 mora
        { kana: "ほん", kanji: "本", mora: 2, tags: ["study","calm"] },
        { kana: "まど", kanji: "窓", mora: 2, tags: ["curious","calm"] },
        { kana: "かさ", kanji: "傘", mora: 2, tags: ["cautious","calm"] },
        { kana: "ゆび", kanji: "指", mora: 2, tags: ["creative","focused"] },
        { kana: "しる", kanji: "知る", mora: 2, tags: ["curious","study"] },
        { kana: "とく", kanji: "解く", mora: 2, tags: ["study","focused"] },
        { kana: "よむ", kanji: "読む", mora: 2, tags: ["study","calm"] },
        { kana: "かく", kanji: "書く", mora: 2, tags: ["creative","study"] },
        { kana: "ちえ", kanji: "知恵", mora: 2, tags: ["study","focused"] },
        { kana: "まど", kanji: "窓", mora: 2, tags: ["curious","calm"] },
        { kana: "ひみつ", kanji: "秘密", mora: 3, tags: ["curious","cautious"] },
        { kana: "ふしぎ", kanji: "不思議", mora: 3, tags: ["curious","creative"] },
        { kana: "はっけん", kanji: "発見", mora: 4, tags: ["curious","optimistic"] },
        { kana: "ぼうけん", kanji: "冒険", mora: 4, tags: ["adventurous","active"] },
        { kana: "しらべる", kanji: "調べる", mora: 4, tags: ["curious","study"] },
        { kana: "おぼえる", kanji: "覚える", mora: 4, tags: ["study","focused"] },
        { kana: "こたえをさがす", kanji: "答えを探す", mora: 7, tags: ["curious","focused"] },
        { kana: "あたらしいかぜ", kanji: "新しい風", mora: 7, tags: ["curious","adventurous"] },

        // =============================================
        // ===== 拡張語彙 — 運・縁・奇跡 =====
        // =============================================
        { kana: "うん", kanji: "運", mora: 2, tags: ["lucky","optimistic"] },
        { kana: "さち", kanji: "幸", mora: 2, tags: ["lucky","optimistic"] },
        { kana: "ふく", kanji: "福", mora: 2, tags: ["lucky","optimistic"] },
        { kana: "めぐみ", kanji: "恵み", mora: 3, tags: ["lucky","empathetic"] },
        { kana: "おかげ", kanji: "おかげ", mora: 3, tags: ["lucky","social"] },
        { kana: "たまもの", kanji: "賜物", mora: 4, tags: ["lucky","patient"] },
        { kana: "めぐりあう", kanji: "巡り会う", mora: 5, tags: ["lucky","social"] },
        { kana: "うんめいの", kanji: "運命の", mora: 5, tags: ["lucky","adventurous"] },
        { kana: "きせきのような", kanji: "奇跡のような", mora: 7, tags: ["lucky","optimistic"] },
        { kana: "めぐまれたひび", kanji: "恵まれた日々", mora: 7, tags: ["lucky","patient"] },

        // =============================================
        // ===== 拡張語彙 — 計画・秩序・慎重 =====
        // =============================================
        { kana: "じゅんばん", kanji: "順番", mora: 4, tags: ["organized","patient"] },
        { kana: "きちんと", kanji: "きちんと", mora: 4, tags: ["organized","focused"] },
        { kana: "そなえる", kanji: "備える", mora: 4, tags: ["organized","cautious"] },
        { kana: "ととのえる", kanji: "整える", mora: 5, tags: ["organized","calm"] },
        { kana: "しっかりと", kanji: "しっかりと", mora: 5, tags: ["organized","focused"] },
        { kana: "いちにちいちにち", kanji: "一日一日", mora: 8, tags: ["organized","patient"] },
        { kana: "ていねいに", kanji: "丁寧に", mora: 5, tags: ["organized","calm"] },
        { kana: "つみあげた", kanji: "積み上げた", mora: 5, tags: ["organized","patient"] },
        { kana: "みちすじを", kanji: "道筋を", mora: 5, tags: ["organized","focused"] },
        { kana: "こころして", kanji: "心して", mora: 5, tags: ["cautious","focused"] },
        { kana: "ためらいも", kanji: "ためらいも", mora: 5, tags: ["cautious","calm"] },
        { kana: "みきわめて", kanji: "見極めて", mora: 5, tags: ["cautious","focused"] },
        { kana: "そっとてをのばす", kanji: "そっと手を伸ばす", mora: 8, tags: ["cautious","empathetic"] },

        // =============================================
        // ===== 拡張語彙 — 追加 混合 =====
        // =============================================
        // more 2 mora content words
        { kana: "ゆび", kanji: "指", mora: 2, tags: ["creative","focused"] },
        { kana: "かた", kanji: "肩", mora: 2, tags: ["social","calm"] },
        { kana: "うで", kanji: "腕", mora: 2, tags: ["active","resilient"] },
        { kana: "はし", kanji: "橋", mora: 2, tags: ["adventurous","social"] },
        { kana: "みち", kanji: "道", mora: 2, tags: ["adventurous","patient"] },
        { kana: "ちず", kanji: "地図", mora: 2, tags: ["adventurous","organized"] },
        { kana: "かね", kanji: "鐘", mora: 2, tags: ["creative","calm"] },
        { kana: "きぬ", kanji: "絹", mora: 2, tags: ["creative","calm"] },
        { kana: "にし", kanji: "西", mora: 2, tags: ["adventurous","calm"] },
        { kana: "さか", kanji: "坂", mora: 2, tags: ["adventurous","resilient"] },
        { kana: "もん", kanji: "門", mora: 2, tags: ["adventurous","organized"] },
        // more 3 mora
        { kana: "こかげ", kanji: "木陰", mora: 3, tags: ["calm","patient"] },
        { kana: "ひなた", kanji: "日向", mora: 3, tags: ["optimistic","calm"] },
        { kana: "やすらぎ", kanji: "安らぎ", mora: 4, tags: ["calm","patient"] },
        { kana: "にぎわい", kanji: "賑わい", mora: 4, tags: ["social","active"] },
        { kana: "けはい", kanji: "気配", mora: 3, tags: ["cautious","curious"] },
        { kana: "ぬくもり", kanji: "温もり", mora: 4, tags: ["empathetic","calm"] },
        { kana: "みちしるべ", kanji: "道標", mora: 5, tags: ["adventurous","focused"] },
        { kana: "あまやどり", kanji: "雨宿り", mora: 5, tags: ["calm","patient"] },
        { kana: "はなたば", kanji: "花束", mora: 4, tags: ["social","creative"] },
        { kana: "かわせみ", kanji: "翡翠", mora: 4, tags: ["calm","creative"] },
        { kana: "くちぶえ", kanji: "口笛", mora: 4, tags: ["expressive","creative"] },
        { kana: "ひだまり", kanji: "陽だまり", mora: 4, tags: ["calm","optimistic"] },
        { kana: "かみなり", kanji: "雷", mora: 4, tags: ["active","adventurous"] },
        { kana: "ともしび", kanji: "灯火", mora: 4, tags: ["calm","optimistic"] },
        // more 5 mora
        { kana: "かたりあう", kanji: "語り合う", mora: 5, tags: ["social","expressive"] },
        { kana: "みちをゆく", kanji: "道をゆく", mora: 5, tags: ["adventurous","patient"] },
        { kana: "おおぞらへ", kanji: "大空へ", mora: 5, tags: ["adventurous","optimistic"] },
        { kana: "かぜをよぶ", kanji: "風を呼ぶ", mora: 5, tags: ["adventurous","active"] },
        { kana: "うみをこえ", kanji: "海を越え", mora: 5, tags: ["adventurous","resilient"] },
        { kana: "ゆめをおう", kanji: "夢を追う", mora: 5, tags: ["optimistic","active"] },
        { kana: "ほしをみる", kanji: "星を見る", mora: 5, tags: ["curious","calm"] },
        { kana: "にじのかなた", kanji: "虹の彼方", mora: 6, tags: ["adventurous","optimistic"] },
        { kana: "かぜのように", kanji: "風のように", mora: 6, tags: ["adventurous","calm"] },
        { kana: "つきのしずく", kanji: "月の雫", mora: 6, tags: ["calm","creative"] },
        { kana: "ゆめのかけら", kanji: "夢の欠片", mora: 6, tags: ["creative","optimistic"] },
        { kana: "ほしのうたを", kanji: "星の歌を", mora: 6, tags: ["creative","curious"] },
        { kana: "こころひとつ", kanji: "心ひとつ", mora: 6, tags: ["focused","empathetic"] },
        { kana: "ひかりあふれ", kanji: "光溢れ", mora: 6, tags: ["optimistic","creative"] },
        { kana: "こころからの", kanji: "心からの", mora: 6, tags: ["empathetic","social"] },
        { kana: "まだみぬあす", kanji: "まだ見ぬ明日", mora: 6, tags: ["adventurous","optimistic"] },
        { kana: "かなたをめざし", kanji: "彼方を目指し", mora: 7, tags: ["adventurous","focused"] },
        { kana: "うたにのせて", kanji: "歌に乗せて", mora: 6, tags: ["expressive","creative"] },
        // more 8 mora
        { kana: "ゆめにみたけしきを", kanji: "夢に見た景色を", mora: 8, tags: ["optimistic","creative"] },
        { kana: "こころにはなをさかせ", kanji: "心に花を咲かせ", mora: 8, tags: ["optimistic","creative"] },
        { kana: "ともにうたうあしたへ", kanji: "共に歌う明日へ", mora: 8, tags: ["social","optimistic"] },
        { kana: "くれないのそらのした", kanji: "紅の空の下", mora: 8, tags: ["creative","calm"] },
        { kana: "あたたかなてのひら", kanji: "温かな手のひら", mora: 8, tags: ["empathetic","calm"] },

        // =============================================
        // ===== 追加拡張 — 和歌・俳句的表現 =====
        // =============================================
        { kana: "はるのよい", kanji: "春の宵", mora: 5, tags: ["calm","optimistic"] },
        { kana: "あきのくれ", kanji: "秋の暮", mora: 5, tags: ["calm","patient"] },
        { kana: "ふゆのつき", kanji: "冬の月", mora: 5, tags: ["calm","patient"] },
        { kana: "なつのひざし", kanji: "夏の陽射し", mora: 6, tags: ["active","optimistic"] },
        { kana: "ゆきのはな", kanji: "雪の花", mora: 5, tags: ["calm","creative"] },
        { kana: "つきのみち", kanji: "月の道", mora: 5, tags: ["calm","adventurous"] },
        { kana: "はなのいろ", kanji: "花の色", mora: 5, tags: ["creative","calm"] },
        { kana: "かぜのおと", kanji: "風の音", mora: 5, tags: ["calm","creative"] },
        { kana: "みずのおと", kanji: "水の音", mora: 5, tags: ["calm","creative"] },
        { kana: "はるがすみ", kanji: "春霞", mora: 5, tags: ["calm","creative"] },
        { kana: "あきのかぜ", kanji: "秋の風", mora: 5, tags: ["calm","patient"] },
        { kana: "ゆきやなぎ", kanji: "雪柳", mora: 5, tags: ["calm","creative"] },
        { kana: "くれないに", kanji: "紅に", mora: 5, tags: ["creative","expressive"] },
        { kana: "はなあかり", kanji: "花明かり", mora: 5, tags: ["calm","creative"] },
        { kana: "よいのつき", kanji: "宵の月", mora: 5, tags: ["calm","creative"] },
        { kana: "あさぼらけ", kanji: "朝朗け", mora: 5, tags: ["optimistic","calm"] },
        { kana: "ゆうまぐれ", kanji: "夕まぐれ", mora: 5, tags: ["calm","patient"] },
        { kana: "やまのは", kanji: "山の端", mora: 4, tags: ["calm","adventurous"] },
        { kana: "かわせ", kanji: "川瀬", mora: 3, tags: ["calm","adventurous"] },
        { kana: "しおじ", kanji: "潮路", mora: 3, tags: ["adventurous","calm"] },

        // ===== 追加 — 四字熟語・故事成語的 =====
        { kana: "じゅうにんといろ", kanji: "十人十色", mora: 7, tags: ["social","creative"] },
        { kana: "いっきいちゆう", kanji: "一喜一憂", mora: 7, tags: ["empathetic","patient"] },
        { kana: "しんきいってん", kanji: "心機一転", mora: 7, tags: ["resilient","adventurous"] },
        { kana: "ふうりんかざん", kanji: "風林火山", mora: 7, tags: ["active","focused"] },
        { kana: "いちにちいちぜん", kanji: "一日一善", mora: 8, tags: ["organized","empathetic"] },
        { kana: "しちてんはっき", kanji: "七転八起", mora: 7, tags: ["resilient","active"] },
        { kana: "ばんぶつりゅうてん", kanji: "万物流転", mora: 8, tags: ["patient","calm"] },
        { kana: "おんこちしん", kanji: "温故知新", mora: 6, tags: ["study","patient"] },
        { kana: "ゆいがどくそん", kanji: "唯我独尊", mora: 7, tags: ["focused","resilient"] },
        { kana: "めいきょうしすい", kanji: "明鏡止水", mora: 7, tags: ["calm","focused"] },

        // ===== 追加 — 動詞（文語・雅語調） =====
        { kana: "たゆたう", kanji: "揺蕩う", mora: 4, tags: ["calm","creative"] },
        { kana: "うつろう", kanji: "移ろう", mora: 4, tags: ["patient","calm"] },
        { kana: "ほころぶ", kanji: "綻ぶ", mora: 4, tags: ["optimistic","calm"] },
        { kana: "ときはなつ", kanji: "解き放つ", mora: 5, tags: ["adventurous","active"] },
        { kana: "さすらう", kanji: "彷徨う", mora: 4, tags: ["adventurous","calm"] },
        { kana: "したう", kanji: "慕う", mora: 3, tags: ["empathetic","social"] },
        { kana: "うべなう", kanji: "肯う", mora: 4, tags: ["calm","patient"] },
        { kana: "たずさえ", kanji: "携え", mora: 4, tags: ["social","adventurous"] },
        { kana: "ほどこす", kanji: "施す", mora: 4, tags: ["empathetic","social"] },
        { kana: "いつくしむ", kanji: "慈しむ", mora: 5, tags: ["empathetic","calm"] },
        { kana: "へだてなく", kanji: "隔てなく", mora: 5, tags: ["social","empathetic"] },
        { kana: "つらなる", kanji: "連なる", mora: 4, tags: ["social","patient"] },
        { kana: "かさなる", kanji: "重なる", mora: 4, tags: ["patient","social"] },
        { kana: "おもいはせ", kanji: "思い馳せ", mora: 5, tags: ["empathetic","patient"] },
        { kana: "ただよう", kanji: "漂う", mora: 4, tags: ["calm","adventurous"] },
        { kana: "しずまる", kanji: "鎮まる", mora: 4, tags: ["calm","patient"] },
        { kana: "にじむ", kanji: "滲む", mora: 3, tags: ["calm","empathetic"] },
        { kana: "ささやく", kanji: "囁く", mora: 4, tags: ["calm","social"] },
        { kana: "たなびく", kanji: "棚引く", mora: 4, tags: ["calm","creative"] },
        { kana: "きらめく", kanji: "煌めく", mora: 4, tags: ["creative","optimistic"] },

        // ===== 追加 — 形容詞・形容動詞 =====
        { kana: "おぼろげな", kanji: "朧げな", mora: 5, tags: ["calm","creative"] },
        { kana: "ほのかな", kanji: "仄かな", mora: 4, tags: ["calm","cautious"] },
        { kana: "けなげな", kanji: "健気な", mora: 4, tags: ["resilient","empathetic"] },
        { kana: "ひそやかな", kanji: "密やかな", mora: 5, tags: ["calm","cautious"] },
        { kana: "なだらかな", kanji: "なだらかな", mora: 5, tags: ["calm","patient"] },
        { kana: "つつましい", kanji: "慎ましい", mora: 5, tags: ["cautious","calm"] },
        { kana: "いさぎよい", kanji: "潔い", mora: 5, tags: ["resilient","focused"] },
        { kana: "まぶしい", kanji: "眩しい", mora: 4, tags: ["optimistic","expressive"] },
        { kana: "いさましい", kanji: "勇ましい", mora: 5, tags: ["resilient","active"] },
        { kana: "ほがらかな", kanji: "朗らかな", mora: 5, tags: ["optimistic","social"] },
        { kana: "しなやかに", kanji: "しなやかに", mora: 5, tags: ["resilient","calm"] },
        { kana: "ゆうぜんと", kanji: "悠然と", mora: 5, tags: ["calm","patient"] },
        { kana: "こうこうと", kanji: "煌々と", mora: 5, tags: ["optimistic","creative"] },
        { kana: "たおやかに", kanji: "嫋やかに", mora: 5, tags: ["calm","creative"] },

        // ===== 追加 — 名詞（混合） =====
        { kana: "あぜみち", kanji: "畦道", mora: 4, tags: ["calm","patient"] },
        { kana: "ほそみち", kanji: "細道", mora: 4, tags: ["adventurous","patient"] },
        { kana: "ゆきみち", kanji: "雪道", mora: 4, tags: ["calm","patient"] },
        { kana: "かわべり", kanji: "川辺り", mora: 4, tags: ["calm","adventurous"] },
        { kana: "まつかぜ", kanji: "松風", mora: 4, tags: ["calm","patient"] },
        { kana: "やまぶき", kanji: "山吹", mora: 4, tags: ["calm","creative"] },
        { kana: "わすれな", kanji: "勿忘", mora: 4, tags: ["empathetic","patient"] },
        { kana: "さざんか", kanji: "山茶花", mora: 4, tags: ["calm","resilient"] },
        { kana: "れんげ", kanji: "蓮華", mora: 3, tags: ["calm","creative"] },
        { kana: "なでしこ", kanji: "撫子", mora: 4, tags: ["calm","empathetic"] },
        { kana: "ききょう", kanji: "桔梗", mora: 4, tags: ["calm","creative"] },
        { kana: "かきつばた", kanji: "杜若", mora: 5, tags: ["calm","creative"] },
        { kana: "うぐいす", kanji: "鶯", mora: 4, tags: ["creative","optimistic"] },
        { kana: "ひばり", kanji: "雲雀", mora: 3, tags: ["optimistic","active"] },
        { kana: "ちどり", kanji: "千鳥", mora: 3, tags: ["calm","adventurous"] },
        { kana: "ゆうぐれ", kanji: "夕暮れ", mora: 4, tags: ["calm","patient"] },
        { kana: "あかつき", kanji: "暁", mora: 4, tags: ["optimistic","calm"] },
        { kana: "しらゆき", kanji: "白雪", mora: 4, tags: ["calm","creative"] },
        { kana: "あまぐも", kanji: "雨雲", mora: 4, tags: ["calm","patient"] },
        { kana: "にいだ", kanji: "新田", mora: 3, tags: ["adventurous","optimistic"] },
        { kana: "すそのの", kanji: "裾野の", mora: 4, tags: ["calm","adventurous"] },
        { kana: "くものうえ", kanji: "雲の上", mora: 5, tags: ["adventurous","optimistic"] },
        { kana: "ふもとから", kanji: "麓から", mora: 5, tags: ["adventurous","patient"] },
        { kana: "おくやまに", kanji: "奥山に", mora: 5, tags: ["calm","adventurous"] },
        { kana: "はまべにて", kanji: "浜辺にて", mora: 5, tags: ["calm","adventurous"] },
        { kana: "はるのひに", kanji: "春の日に", mora: 5, tags: ["optimistic","calm"] },

        // ===== 追加 — 完結フレーズ =====
        { kana: "みちをあゆむ", kanji: "道を歩む", mora: 6, tags: ["adventurous","patient"] },
        { kana: "ゆめをつむぐ", kanji: "夢を紡ぐ", mora: 6, tags: ["creative","optimistic"] },
        { kana: "こえをあわせ", kanji: "声を合わせ", mora: 6, tags: ["social","expressive"] },
        { kana: "おもいをつなぐ", kanji: "想いを繋ぐ", mora: 7, tags: ["empathetic","social"] },
        { kana: "しずかにまつ", kanji: "静かに待つ", mora: 6, tags: ["patient","calm"] },
        { kana: "たそがれにたつ", kanji: "黄昏に立つ", mora: 7, tags: ["calm","patient"] },
        { kana: "えにしのいと", kanji: "縁の糸", mora: 6, tags: ["social","empathetic"] },
        { kana: "いつかかならず", kanji: "いつか必ず", mora: 7, tags: ["optimistic","resilient"] },
        { kana: "まだおわらない", kanji: "まだ終わらない", mora: 7, tags: ["resilient","patient"] },
        { kana: "こころをつたう", kanji: "心を伝う", mora: 7, tags: ["empathetic","expressive"] },
        { kana: "あいをつたえる", kanji: "愛を伝える", mora: 7, tags: ["empathetic","social"] },
        { kana: "きみにとどけ", kanji: "君に届け", mora: 6, tags: ["social","empathetic"] },
        { kana: "しんじてゆく", kanji: "信じてゆく", mora: 6, tags: ["resilient","adventurous"] },
        { kana: "まだまだこれから", kanji: "まだまだこれから", mora: 8, tags: ["optimistic","resilient"] },
        { kana: "はるかなるみちを", kanji: "遥かなる道を", mora: 8, tags: ["adventurous","patient"] },
        { kana: "よあけをまちながら", kanji: "夜明けを待ちながら", mora: 8, tags: ["patient","optimistic"] },
        { kana: "てをかざすそらへ", kanji: "手をかざす空へ", mora: 8, tags: ["adventurous","optimistic"] },
        { kana: "ちからをあわせて", kanji: "力を合わせて", mora: 8, tags: ["social","active"] },
        { kana: "このいのちかがやけ", kanji: "この命輝け", mora: 8, tags: ["resilient","optimistic"] },

        // ===== 追加 — 擬音・歌唱用 =====
        { kana: "ナナナ", kanji: "ナナナ", mora: 3, tags: ["expressive","social"] },
        { kana: "パパパ", kanji: "パパパ", mora: 3, tags: ["expressive","active"] },
        { kana: "ラーラーラ", kanji: "ラーラーラ", mora: 5, tags: ["expressive","optimistic"] },
        { kana: "ルールールー", kanji: "ルールールー", mora: 6, tags: ["expressive","creative"] },
        { kana: "ハミング", kanji: "ハミング", mora: 4, tags: ["expressive","calm"] },

        // ===== 追加 — 希望・夢・光（多様化） =====
        { kana: "のぞみのひかり", kanji: "望みの光", mora: 7, tags: ["optimistic","resilient"] },
        { kana: "あすへのかぜ", kanji: "明日への風", mora: 6, tags: ["optimistic","adventurous"] },
        { kana: "あしたはきっと", kanji: "明日はきっと", mora: 7, tags: ["optimistic","resilient"] },
        { kana: "かなしみのさき", kanji: "悲しみの先", mora: 7, tags: ["empathetic","resilient"] },
        { kana: "よるをこえて", kanji: "夜を越えて", mora: 6, tags: ["resilient","adventurous"] },
        { kana: "やまをこえる", kanji: "山を越える", mora: 6, tags: ["adventurous","resilient"] },
        { kana: "そらがひろがる", kanji: "空が広がる", mora: 7, tags: ["optimistic","adventurous"] },
        { kana: "あさがくれば", kanji: "朝が来れば", mora: 6, tags: ["optimistic","patient"] },
        { kana: "ほしにねがう", kanji: "星に願う", mora: 6, tags: ["optimistic","empathetic"] },
        { kana: "あいにみちて", kanji: "愛に満ちて", mora: 6, tags: ["empathetic","social"] },
        { kana: "すべてがひかり", kanji: "全てが光", mora: 7, tags: ["optimistic","creative"] },
        { kana: "はじめのいっぽ", kanji: "初めの一歩", mora: 7, tags: ["adventurous","optimistic"] },
        { kana: "まだしらないみち", kanji: "まだ知らない道", mora: 8, tags: ["adventurous","curious"] },
        { kana: "いつかきっとまた", kanji: "いつかきっとまた", mora: 8, tags: ["optimistic","patient"] },
        { kana: "てをとりあって", kanji: "手を取り合って", mora: 7, tags: ["social","empathetic"] }
    ];

    // ======== Phrase Type Assignment ========
    // h = head/modifier (naturally precedes a noun/verb)
    // s = sentence (complete standalone clause/expression)
    // t = tail/content (noun, verb, noun phrase — default)
    var _HEAD = {};
    var _hk = [
        "きっと","ずっと","そっと","もっと",
        "きみと","ぼくの","かぜに","そらへ","ゆめの",
        "やさしい","あかるい","たのしい",
        "にぎやか","おだやか","あざやか",
        "まっすぐ","いきいき","ゆっくり",
        "ひとりで","みんなの","ひかりの","こころの",
        "うつくしい","あたたかい","あたらしい",
        "もくひょうへ",
        // expanded heads
        "しずかに","はるかな","かすかな","たしかな","おおきな","ちいさな",
        "いとしき","ゆるやかに","おだやかに","いにしえの","かぎりなく",
        "ひとひらの","あかときの","しらなみの","もみじばの",
        "はかない","こころざしの","たおやかな","あたらしき",
        "ふたりの","ちぎりの","じんせいの","おもいでの","うんめいの",
        "これから","しっかりと","きちんと","ていねいに",
        "さらさら","ゆらゆら","ひらひら","ふわりと","きらりと","そろりと",
        "みちづれの","こころからの","よぞらに","あさひの",
        // 追加拡張 head
        "おぼろげな","ほのかな","けなげな","ひそやかな","なだらかな",
        "まぶしい","ほがらかな","しなやかに","ゆうぜんと","こうこうと","たおやかに",
        "いさぎよい","つつましい","いさましい","なつかしい","いとおしい",
        "はるのひに","おくやまに","はまべにて","ふもとから","くものうえ",
        "すそのの","やまのは","ハミング"
    ];
    for (var _i = 0; _i < _hk.length; _i++) _HEAD[_hk[_i]] = 1;

    var _SENT = {};
    var _sk = [
        "ほら","さあ","ねえ","ああ","もう","まだ",
        "きらきら","このまま",
        "かぜがふく","ゆめをみる","そらをとぶ","はながさく","ほしがふる",
        "うたをうたう","ひがのぼる","あめがやむ","なみがよせる","とびらあける",
        "どこまでも","いつまでも","なんどでも","ここにいる","そばにいる",
        "いつかきっと","どこにいても","えがおのまま","あきらめない",
        "ひかりのなか","こころのおく","わすれないで","それでもまだ",
        "かぜにのって","ゆめをおって","きみがいるから","あしたをしんじ",
        "このせかいで","なみだのあと","てをつないで",
        "あしたへむかう","ひかりをあつめ","こころにひびく","きみとあるいた",
        "つよくなれるよ","わらいあえるひ","おわらないゆめ",
        "このみちをあるく","かぜがうたをはこぶ","ゆめのつづきをみる",
        "いつかまたあえるよ","こころにともしびを",
        "ともだちがいる","こころがおどる","みらいをしんじ",
        "やさしくなれた","しあわせだった","おもいでのなか",
        "ここからはじまる","ひとつずつすすむ","みんなでうたおう",
        "かがやくあしたへ","やさしいきもちで",
        "ラララ",
        // expanded sentences
        "いざ","でも","ただ","えい","まあ","なあ","ルルル","ラーラ",
        "ぽつりぽつり","しんしんと","はらはらと",
        // classical phrases
        "いちごいちえ","えんをむすぶ","はなにあらし","うつろいゆく",
        "みちをてらす","ひとよのゆめ","おもいをこめ",
        "たもとをわかつ","かちょうふうげつ","よすがをもとめ",
        "ゆめのうきはし","いろはにほへと","つきにむらくも","こころにきざむ",
        "おもいをはせるひ","えんはいなもの","よすがをもとめて",
        "いにしえをしのぶ","ゆくかわのながれ","ちぎりをむすぶ",
        // nature phrases
        "あさひがさす","さくらちるひ","つきがてらす","はなにうたう",
        "あめあがりの","ほたるのひかり","かわのながれに","そよかぜがふく",
        "ゆうやけそまるそら","はなびらがまうころ",
        // emotion phrases
        "こころがゆれる","なみだをぬぐう","むねにしまう",
        "おもいはつきず","むねがあつくなる","こいしくて",
        // people phrases
        "あなたがいて","ささえあって","ふたりであるく",
        "であえたことに","きみをおもう","てをふりあい","かたをならべ",
        // action phrases
        "あきらめずに","まえをむいて","たちどまらず","じぶんらしく",
        "ちからづよい","あしあとをのこす",
        // life phrases
        "ときがながれ","あのひをおもう","つきひがめぐる","すぎたひびは",
        "あのころのゆめ","きょうもあしたも","かけがえのない","ひとつひとつが",
        // poetic phrases
        "みちはつづく","あしたがくる","そらにえがく","かぜをきって",
        "ともにあるく","こころをひらく","あいをしるとき","ゆめのつづきへ",
        "ひとりじゃない","ここがはじまり","ひかりがみちる","ゆめをかたろう",
        "このてでつかむ","おもいはとどく","なにもおそれず","ながれるくもの",
        "きみのえがおが","にじのかなた","かぜのように","つきのしずく",
        "ゆめのかけら","ほしのうたを","こころひとつ","ひかりあふれ",
        "まだみぬあす","かなたをめざし","うたにのせて",
        // 8 mora sentences
        "このせかいにうまれ","ひかりのなかへゆく","こころのままにゆく",
        "わすれないこのうた","めをとじればそこに","あのひのやくそくを",
        "ありがとうのことば","いのちがかがやく","ふるさとをおもう",
        "ゆめにみたけしきを","こころにはなをさかせ","ともにうたうあしたへ",
        "くれないのそらのした","あたたかなてのひら",
        "いちにちいちにち","そっとてをのばす",
        // misc
        "めぐりあう","こたえをさがす","あたらしいかぜ",
        "きせきのような","めぐまれたひび",
        "つよくあれ","いっぽずつ","ゆめにむかって",
        "みちをゆく","おおぞらへ","かぜをよぶ","うみをこえ",
        "ゆめをおう","ほしをみる","かたりあう",
        // 追加拡張 sent
        "じゅうにんといろ","いっきいちゆう","しんきいってん","ふうりんかざん",
        "いちにちいちぜん","しちてんはっき","ばんぶつりゅうてん",
        "おんこちしん","ゆいがどくそん","めいきょうしすい",
        "みちをあゆむ","ゆめをつむぐ","こえをあわせ","おもいをつなぐ",
        "しずかにまつ","たそがれにたつ","えにしのいと",
        "いつかかならず","まだおわらない","こころをつたう","あいをつたえる",
        "きみにとどけ","しんじてゆく",
        "まだまだこれから","はるかなるみちを","よあけをまちながら",
        "てをかざすそらへ","ちからをあわせて","このいのちかがやけ",
        "ナナナ","パパパ","ラーラーラ","ルールールー",
        "のぞみのひかり","あすへのかぜ","あしたはきっと",
        "かなしみのさき","よるをこえて","やまをこえる","そらがひろがる",
        "あさがくれば","ほしにねがう","あいにみちて","すべてがひかり",
        "はじめのいっぽ","まだしらないみち","いつかきっとまた","てをとりあって",
        "ときはなつ","へだてなく","おもいはせ","こいしくて"
    ];
    for (var _j = 0; _j < _sk.length; _j++) _SENT[_sk[_j]] = 1;

    for (var _p = 0; _p < PHRASES.length; _p++) {
        PHRASES[_p].type = _HEAD[PHRASES[_p].kana] ? 'h' : _SENT[PHRASES[_p].kana] ? 's' : 't';
    }

    // Normalize mora counts from actual kana expansion (fixes hand-counted mismatches)
    for (var _nm = 0; _nm < PHRASES.length; _nm++) {
        PHRASES[_nm].mora = expandToMorae(PHRASES[_nm].kana).length;
    }

    // ======== VERSE_PATTERNS ========
    var VERSE_PATTERNS = {
        refrain:    { name: "refrain",    score: function(ls) { return (ls.study || 0) * 2 + (ls.organized || 0) * 1.5; } },
        contrast:   { name: "contrast",   score: function(ls) { return (ls.cautious || 0) * 1.5 + (ls.adventurous || 0) * 1.5; } },
        escalation: { name: "escalation", score: function(ls) { return (ls.active || 0) * 2 + (ls.expressive || 0) * 1.5; } },
        question:   { name: "question",   score: function(ls) { return (ls.curious || 0) * 2 + (ls.study || 0) * 1.5; } },
        parallel:   { name: "parallel",   score: function(ls) { return (ls.social || 0) * 2 + (ls.empathetic || 0) * 1.5; } },
        bookend:    { name: "bookend",    score: function(ls) { return (ls.calm || 0) * 2 + (ls.patient || 0) * 1.5; } }
    };

    // ======== Core Functions ========

    function expandToMorae(word) {
        var morae = [];
        var chars = Array.from(word);
        for (var i = 0; i < chars.length; i++) {
            var ch = chars[i];
            if (ch === 'ゃ' || ch === 'ゅ' || ch === 'ょ' ||
                ch === 'ャ' || ch === 'ュ' || ch === 'ョ') {
                if (morae.length > 0) {
                    morae[morae.length - 1].char += ch;
                    var smallMap = {'ゃ':'a','ゅ':'u','ょ':'o','ャ':'a','ュ':'u','ョ':'o'};
                    morae[morae.length - 1].vowel = smallMap[ch] || morae[morae.length - 1].vowel;
                }
                continue;
            }
            if (ch === 'ー') {
                var prevVowel = morae.length > 0 ? morae[morae.length - 1].vowel : 'a';
                morae.push({ char: ch, vowel: prevVowel === 'n' ? 'a' : prevVowel });
                continue;
            }
            var vowel = KANA_VOWEL[ch];
            if (vowel === undefined) vowel = 'a';
            morae.push({ char: ch, vowel: vowel });
        }
        return morae;
    }

    function extractPhrases(leadAttacksArr, patternLen, stepsPerBar) {
        if (!stepsPerBar) stepsPerBar = 16; // default: 4 beats × 4 steps
        // Group 2 bars into one "line" so phrases are long enough
        // for sentence-like selections (5-10 morae instead of 3-6)
        var barsPerLine = 2;
        var stepsPerLine = stepsPerBar * barsPerLine;
        var numLines = Math.ceil(patternLen / stepsPerLine);
        var phrases = [];

        for (var line = 0; line < numLines; line++) {
            var lineStart = line * stepsPerLine;
            var lineEnd = Math.min(lineStart + stepsPerLine, patternLen);
            var attackSteps = [];

            for (var s = lineStart; s < lineEnd; s++) {
                if (leadAttacksArr && leadAttacksArr[s]) {
                    attackSteps.push(s);
                }
            }

            if (attackSteps.length > 0) {
                phrases.push({
                    startStep: attackSteps[0],
                    moraCount: attackSteps.length,
                    attackSteps: attackSteps
                });
            }
        }

        if (phrases.length === 0) {
            phrases.push({ startStep: 0, moraCount: 8, attackSteps: [0,2,4,6,8,10,12,14] });
        }

        return phrases;
    }

    function selectPattern(labelSums) {
        var best = null;
        var bestScore = -1;
        var keys = Object.keys(VERSE_PATTERNS);
        for (var i = 0; i < keys.length; i++) {
            var pat = VERSE_PATTERNS[keys[i]];
            var s = pat.score(labelSums) + Math.random() * 2;
            if (s > bestScore) { bestScore = s; best = pat; }
        }
        return best || VERSE_PATTERNS.escalation;
    }

    /**
     * selectPhrasesForMora: pick phrase fragments with chain-aware scoring
     *
     * Type chaining rules (soft penalties via score multipliers):
     *   h → t/s : natural (modifier + content)  ×1.5
     *   t/s → h : starts new clause              ×1.3
     *   t → t   : word listing — discouraged     ×0.15
     *   h → h   : double modifier — discouraged  ×0.1
     *   s → s   : OK (two complete clauses)      ×1.0
     */
    function selectPhrasesForMora(moraCount, labelSums, usedSet) {
        function scorePhrase(p, prevType) {
            var s = 1;
            for (var i = 0; i < p.tags.length; i++) {
                s += (labelSums[p.tags[i]] || 0) * 0.5;
            }
            if (usedSet[p.kana]) s *= 0.15;

            // Chain scoring
            if (prevType) {
                var t = p.type || 't';
                if (prevType === 't' && t === 't') s *= 0.15;
                if (prevType === 'h' && t === 'h') s *= 0.1;
                if (prevType === 'h' && (t === 't' || t === 's')) s *= 1.5;
                if ((prevType === 't' || prevType === 's') && t === 'h') s *= 1.3;
            }

            return s;
        }

        function weightedPick(arr, prevType) {
            var total = 0;
            var scores = [];
            for (var i = 0; i < arr.length; i++) {
                var sc = scorePhrase(arr[i], prevType);
                scores.push(sc);
                total += sc;
            }
            if (total <= 0) return arr[Math.floor(Math.random() * arr.length)];
            var roll = Math.random() * total;
            var acc = 0;
            for (var j = 0; j < arr.length; j++) {
                acc += scores[j];
                if (acc >= roll) return arr[j];
            }
            return arr[arr.length - 1];
        }

        var result = [];
        var remaining = moraCount;
        var maxIter = 10;
        var prevType = null;

        while (remaining > 0 && maxIter-- > 0) {
            var candidates = [];
            for (var i = 0; i < PHRASES.length; i++) {
                var p = PHRASES[i];
                if (p.mora > remaining) continue;
                if (p.mora === 1 && remaining > 1) continue;
                candidates.push(p);
            }
            if (candidates.length === 0) break;

            // Prefer exact fits
            var exact = [];
            for (var j = 0; j < candidates.length; j++) {
                if (candidates[j].mora === remaining) exact.push(candidates[j]);
            }
            if (exact.length > 0) candidates = exact;

            // Prefer longer phrases (fewer fragments = less listing)
            if (remaining >= 3 && exact.length === 0) {
                var longer = [];
                var minPreferred = remaining >= 5 ? 3 : 2;
                for (var k = 0; k < candidates.length; k++) {
                    if (candidates[k].mora >= minPreferred) longer.push(candidates[k]);
                }
                if (longer.length > 0) candidates = longer;
            }

            var picked = weightedPick(candidates, prevType);
            result.push(picked);
            usedSet[picked.kana] = true;
            remaining -= picked.mora;
            prevType = picked.type || 't';
        }

        return result;
    }

    /**
     * buildVerse: generate one verse from phrases + label weights
     */
    function buildVerse(phrases, labelSums, usedSet) {
        var verseFragments = [];
        var moraMap = {};
        var displayIndex = 0;

        for (var p = 0; p < phrases.length; p++) {
            var phrase = phrases[p];
            var selected = selectPhrasesForMora(phrase.moraCount, labelSums, usedSet);

            var morae = [];
            for (var fi = 0; fi < selected.length; fi++) {
                var expanded = expandToMorae(selected[fi].kana);
                for (var mi = 0; mi < expanded.length; mi++) {
                    morae.push({
                        char: expanded[mi].char,
                        vowel: expanded[mi].vowel,
                        fragIndex: verseFragments.length + fi
                    });
                }
            }

            for (var fi2 = 0; fi2 < selected.length; fi2++) {
                verseFragments.push(selected[fi2]);
            }

            for (var ai = 0; ai < phrase.attackSteps.length && ai < morae.length; ai++) {
                var step = phrase.attackSteps[ai];
                moraMap[step] = {
                    char: morae[ai].char,
                    vowel: morae[ai].vowel,
                    displayIndex: displayIndex,
                    fragIndex: morae[ai].fragIndex
                };
                displayIndex++;
            }
        }

        // Build displayWords
        var displayWords = [];
        var fragFirstMora = {};
        var sortedSteps = Object.keys(moraMap).map(Number).sort(function(a,b){return a-b;});
        for (var si = 0; si < sortedSteps.length; si++) {
            var mm = moraMap[sortedSteps[si]];
            if (fragFirstMora[mm.fragIndex] === undefined) {
                fragFirstMora[mm.fragIndex] = mm.displayIndex;
            }
        }
        for (var di = 0; di < verseFragments.length; di++) {
            if (fragFirstMora[di] === undefined) continue;
            displayWords.push({
                text: verseFragments[di].kanji,
                firstDisplayIndex: fragFirstMora[di],
                fragIndex: di
            });
        }

        var text = "";
        for (var tw = 0; tw < displayWords.length; tw++) {
            if (tw > 0) text += " ";
            text += displayWords[tw].text;
        }

        return {
            text: text,
            words: verseFragments,
            moraMap: moraMap,
            displayWords: displayWords
        };
    }

    /**
     * cloneVerse: deep-copy a verse (for refrain/bookend repetition)
     */
    function cloneVerse(v) {
        var newMoraMap = {};
        var keys = Object.keys(v.moraMap);
        for (var i = 0; i < keys.length; i++) {
            var m = v.moraMap[keys[i]];
            newMoraMap[keys[i]] = {
                char: m.char, vowel: m.vowel,
                displayIndex: m.displayIndex, fragIndex: m.fragIndex
            };
        }
        var newDW = [];
        for (var j = 0; j < v.displayWords.length; j++) {
            var dw = v.displayWords[j];
            newDW.push({ text: dw.text, firstDisplayIndex: dw.firstDisplayIndex, fragIndex: dw.fragIndex });
        }
        return {
            text: v.text,
            words: v.words.slice(),
            moraMap: newMoraMap,
            displayWords: newDW
        };
    }

    /**
     * boostLabels: return a modified labelSums with certain tags boosted
     */
    function boostLabels(labelSums, boostTags, factor) {
        var out = {};
        var keys = Object.keys(labelSums);
        for (var i = 0; i < keys.length; i++) out[keys[i]] = labelSums[keys[i]];
        for (var j = 0; j < boostTags.length; j++) {
            out[boostTags[j]] = (out[boostTags[j]] || 0) + factor;
        }
        return out;
    }

    /**
     * generateLyrics: produce 4 verses structured by the selected pattern
     *
     * Patterns:
     *   refrain:    A B A B (verse 1,3 same / verse 2,4 same)
     *   contrast:   A B A' B' (calm vs active alternation)
     *   escalation: gradually more energetic tags across verses
     *   question:   curious/reflective tone boosted
     *   parallel:   similar structure, social/empathetic emphasis
     *   bookend:    A B C A (verse 4 = verse 1 reprise)
     */
    function generateLyrics(leadAttacksArr, patternLen, labelSums, stepsPerBar) {
        var pattern = selectPattern(labelSums);
        var phrases = extractPhrases(leadAttacksArr, patternLen, stepsPerBar);
        var verses = [];
        var usedSet = {};

        switch (pattern.name) {

            case 'refrain': {
                // A B A B
                var vA = buildVerse(phrases, labelSums, usedSet);
                var vB = buildVerse(phrases, labelSums, usedSet);
                verses = [vA, vB, cloneVerse(vA), cloneVerse(vB)];
                break;
            }

            case 'contrast': {
                // Alternate calm vs active emphasis
                var calmLabels   = boostLabels(labelSums, ['calm','patient','empathetic'], 4);
                var activeLabels = boostLabels(labelSums, ['active','adventurous','expressive'], 4);
                var v1 = buildVerse(phrases, calmLabels, usedSet);
                var v2 = buildVerse(phrases, activeLabels, usedSet);
                usedSet = {};
                var v3 = buildVerse(phrases, calmLabels, usedSet);
                var v4 = buildVerse(phrases, activeLabels, usedSet);
                verses = [v1, v2, v3, v4];
                break;
            }

            case 'escalation': {
                // Gradually boost energy: calm → active
                var esc = ['active','expressive','adventurous','resilient'];
                for (var ev = 0; ev < 4; ev++) {
                    var escLabels = boostLabels(labelSums, esc, ev * 2);
                    verses.push(buildVerse(phrases, escLabels, usedSet));
                    if (ev === 1) usedSet = {};
                }
                break;
            }

            case 'question': {
                // Boost curious/reflective tags throughout
                var qLabels = boostLabels(labelSums, ['curious','study','focused'], 3);
                for (var qv = 0; qv < 4; qv++) {
                    verses.push(buildVerse(phrases, qLabels, usedSet));
                    if (qv === 1) usedSet = {};
                }
                break;
            }

            case 'parallel': {
                // Social/empathetic emphasis, consistent tone
                var pLabels = boostLabels(labelSums, ['social','empathetic','optimistic'], 3);
                for (var pv = 0; pv < 4; pv++) {
                    verses.push(buildVerse(phrases, pLabels, usedSet));
                    if (pv === 1) usedSet = {};
                }
                break;
            }

            case 'bookend': {
                // A B C A — verse 4 reprises verse 1
                var bA = buildVerse(phrases, labelSums, usedSet);
                var bB = buildVerse(phrases, labelSums, usedSet);
                usedSet = {};
                var bC = buildVerse(phrases, labelSums, usedSet);
                verses = [bA, bB, bC, cloneVerse(bA)];
                break;
            }

            default: {
                for (var dv = 0; dv < 4; dv++) {
                    verses.push(buildVerse(phrases, labelSums, usedSet));
                    if (dv === 1) usedSet = {};
                }
                break;
            }
        }

        return { verses: verses, pattern: pattern.name };
    }

    // ======== Export ========
    window.TTLLyrics = {
        FORMANTS: FORMANTS,
        KANA_VOWEL: KANA_VOWEL,
        expandToMorae: expandToMorae,
        extractPhrases: extractPhrases,
        selectPattern: selectPattern,
        generateLyrics: generateLyrics
    };
})();
