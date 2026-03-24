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
        { kana: "やさしいきもちで", kanji: "優しい気持ちで", mora: 8, tags: ["empathetic","calm"] }
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
        "もくひょうへ"
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
        "ラララ"
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
