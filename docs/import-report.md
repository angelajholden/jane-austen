# Jane Austen Database Import Report

## Execution status

- **Status:** PARSER AUDIT REQUIRED
- **Generated:** 2026-08-08T16:28:55.792Z
- **Configured books:** 6
- **Books processed:** 6
- **Published database:** No

## Failure

```text
Parsed reference counts differ in 39 chapter(s); database was not published.
```

## Book totals

| Book | Chapters E/P | Paragraphs E/P | Characters | Character aliases | Locations | Location aliases |
|---|---:|---:|---:|---:|---:|---:|
| Emma (`emma`) | 55/55 | 2319/2319 | 33 | 26 | 22 | 0 |
| Mansfield Park (`mansfield-park`) | 48/48 | 1792/1792 | 30 | 27 | 20 | 0 |
| Northanger Abbey (`northanger-abbey`) | 31/31 | 1021/1021 | 21 | 18 | 20 | 0 |
| Persuasion (`persuasion`) | 24/24 | 1010/1010 | 30 | 26 | 30 | 0 |
| Pride and Prejudice (`pride-and-prejudice`) | 61/61 | 2121/2060 | 48 | 58 | 49 | 7 |
| Sense and Sensibility (`sense-and-sensibility`) | 50/50 | 1809/1809 | 30 | 29 | 28 | 0 |

## Chapter-level discrepancies

### Pride and Prejudice: Chapter 1

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-1` (ordinal 1)
- **Expected paragraphs:** 36
- **Parsed paragraphs:** 34
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 699-700:

```text
It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife.
```

Source lines 752-754:

```text
“Design? Nonsense, how can you talk so! But it is very likely that he _may_ fall in love with one of them, and therefore you must visit him as soon as he comes.”
```

Source lines 809-815:

```text
Mr. Bennet was so odd a mixture of quick parts, sarcastic humour, reserve, and caprice, that the experience of three-and-twenty years had been insufficient to make his wife understand his character. _Her_ mind was less difficult to develope. She was a woman of mean understanding, little information, and uncertain temper. When she was discontented, she fancied herself nervous. The business of her life was to get her daughters married: its solace was visiting and news.
```

Excluded source blocks in this chapter:

- illustration, source lines 721-725

```text
[Illustration: “He came down to see the place” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 817-819

```text
[Illustration: M^{r.} & M^{rs.} Bennet [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 824-828

```text
[Illustration: “I hope Mr. Bingley will like it” [_Copyright 1894 by George Allen._]]
```

### Pride and Prejudice: Chapter 2

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-2` (ordinal 2)
- **Expected paragraphs:** 28
- **Parsed paragraphs:** 27
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 838-843:

```text
Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it. It was then disclosed in the following manner. Observing his second daughter employed in trimming a hat, he suddenly addressed her with,--
```

Source lines 881-882:

```text
“Impossible, Mr. Bennet, impossible, when I am not acquainted with him myself; how can you be so teasing?”
```

Source lines 937-939:

```text
The rest of the evening was spent in conjecturing how soon he would return Mr. Bennet’s visit, and determining when they should ask him to dinner.
```

Excluded source blocks in this chapter:

- illustration, source lines 836-836

```text
[Illustration]
```

- illustration, source lines 941-941

```text
[Illustration: “I’m the tallest”]
```

- illustration, source lines 946-949

```text
[Illustration: “He rode a black horse” ]
```

### Pride and Prejudice: Chapter 3

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-3` (ordinal 3)
- **Expected paragraphs:** 23
- **Parsed paragraphs:** 21
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 959-970:

```text
Not all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject, was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways, with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all; and they were at last obliged to accept the second-hand intelligence of their neighbour, Lady Lucas. Her report was highly favourable. Sir William had been delighted with him. He was quite young, wonderfully handsome, extremely agreeable, and, to crown the whole, he meant to be at the next assembly with a large party. Nothing could be more delightful! To be fond of dancing was a certain step towards falling in love; and very lively hopes of Mr. Bingley’s heart were entertained.
```

Source lines 1055-1058:

```text
“I would not be so fastidious as you are,” cried Bingley, “for a kingdom! Upon my honour, I never met with so many pleasant girls in my life as I have this evening; and there are several of them, you see, uncommonly pretty.”
```

Source lines 1130-1135:

```text
“But I can assure you,” she added, “that Lizzy does not lose much by not suiting _his_ fancy; for he is a most disagreeable, horrid man, not at all worth pleasing. So high and so conceited, that there was no enduring him! He walked here, and he walked there, fancying himself so very great! Not handsome enough to dance with! I wish you had been there, my dear, to have given him one of your set-downs. I quite detest the man.”
```

Excluded source blocks in this chapter:

- illustration, source lines 957-957

```text
[Illustration]
```

- illustration, source lines 994-998

```text
[Illustration: “When the Party entered” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 1067-1071

```text
[Illustration: “She is tolerable” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 1140-1140

```text
[Illustration]
```

### Pride and Prejudice: Chapter 6

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-6` (ordinal 6)
- **Expected paragraphs:** 55
- **Parsed paragraphs:** 54
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 1399-1417:

```text
The ladies of Longbourn soon waited on those of Netherfield. The visit was returned in due form. Miss Bennet’s pleasing manners grew on the good-will of Mrs. Hurst and Miss Bingley; and though the mother was found to be intolerable, and the younger sisters not worth speaking to, a wish of being better acquainted with _them_ was expressed towards the two eldest. By Jane this attention was received with the greatest pleasure; but Elizabeth still saw superciliousness in their treatment of everybody, hardly excepting even her sister, and could not like them; though their kindness to Jane, such as it was, had a value, as arising, in all probability, from the influence of their brother’s admiration. It was generally evident, whenever they met, that he _did_ admire her; and to _her_ it was equally evident that Jane was yielding to the preference which she had begun to entertain for him from the first, and was in a way to be very much in love; but she considered with pleasure that it was not likely to be discovered by the world in general, since Jane united with great strength of feeling, a composure of temper and an uniform cheerfulness of manner, which would guard her from the suspicions of the impertinent. She mentioned this to her friend, Miss Lucas.
```

Source lines 1572-1574:

```text
Sir William only smiled. “Your friend performs delightfully,” he continued, after a pause, on seeing Bingley join the group; “and I doubt not that you are an adept in the science yourself, Mr. Darcy.”
```

Source lines 1661-1663:

```text
He listened to her with perfect indifference, while she chose to entertain herself in this manner; and as his composure convinced her that all was safe, her wit flowed along.
```

Excluded source blocks in this chapter:

- illustration, source lines 1397-1397

```text
[Illustration]
```

- illustration, source lines 1513-1514

```text
[Illustration: “The entreaties of several” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 1668-1672

```text
[Illustration: “A note for Miss Bennet” [_Copyright 1894 by George Allen._]]
```

### Pride and Prejudice: Chapter 7

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-7` (ordinal 7)
- **Expected paragraphs:** 51
- **Parsed paragraphs:** 49
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 1682-1687:

```text
Mr. Bennet’s property consisted almost entirely in an estate of two thousand a year, which, unfortunately for his daughters, was entailed, in default of heirs male, on a distant relation; and their mother’s fortune, though ample for her situation in life, could but ill supply the deficiency of his. Her father had been an attorney in Meryton, and had left her four thousand pounds.
```

Source lines 1789-1790:

```text
“Oh, but the gentlemen will have Mr. Bingley’s chaise to go to Meryton; and the Hursts have no horses to theirs.”
```

Source lines 1908-1915:

```text
When the clock struck three, Elizabeth felt that she must go, and very unwillingly said so. Miss Bingley offered her the carriage, and she only wanted a little pressing to accept it, when Jane testified such concern at parting with her that Miss Bingley was obliged to convert the offer of the chaise into an invitation to remain at Netherfield for the present. Elizabeth most thankfully consented, and a servant was despatched to Longbourn, to acquaint the family with her stay, and bring back a supply of clothes.
```

Excluded source blocks in this chapter:

- illustration, source lines 1680-1680

```text
[Illustration]
```

- illustration, source lines 1797-1797

```text
[Illustration: Cheerful prognostics]
```

- illustration, source lines 1917-1920

```text
[Illustration: “The Apothecary came” ]
```

- illustration, source lines 1925-1928

```text
[Illustration: “covering a screen” ]
```

### Pride and Prejudice: Chapter 8

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-8` (ordinal 8)
- **Expected paragraphs:** 60
- **Parsed paragraphs:** 59
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 1938-1947:

```text
At five o’clock the two ladies retired to dress, and at half-past six Elizabeth was summoned to dinner. To the civil inquiries which then poured in, and amongst which she had the pleasure of distinguishing the much superior solicitude of Mr. Bingley, she could not make a very favourable answer. Jane was by no means better. The sisters, on hearing this, repeated three or four times how much they were grieved, how shocking it was to have a bad cold, and how excessively they disliked being ill themselves; and then thought no more of the matter: and their indifference towards Jane, when not immediately before them, restored Elizabeth to the enjoyment of all her original dislike.
```

Source lines 2062-2063:

```text
“It ought to be good,” he replied: “it has been the work of many generations.”
```

Source lines 2168-2179:

```text
Elizabeth joined them again only to say that her sister was worse, and that she could not leave her. Bingley urged Mr. Jones’s being sent for immediately; while his sisters, convinced that no country advice could be of any service, recommended an express to town for one of the most eminent physicians. This she would not hear of; but she was not so unwilling to comply with their brother’s proposal; and it was settled that Mr. Jones should be sent for early in the morning, if Miss Bennet were not decidedly better. Bingley was quite uncomfortable; his sisters declared that they were miserable. They solaced their wretchedness, however, by duets after supper; while he could find no better relief to his feelings than by giving his housekeeper directions that every possible attention might be paid to the sick lady and her sister.
```

Excluded source blocks in this chapter:

- illustration, source lines 1936-1936

```text
[Illustration]
```

- illustration, source lines 2184-2188

```text
[Illustration: M^{rs} Bennet and her two youngest girls [_Copyright 1894 by George Allen._]]
```

### Pride and Prejudice: Chapter 10

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-10` (ordinal 10)
- **Expected paragraphs:** 68
- **Parsed paragraphs:** 66
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 2400-2407:

```text
The day passed much as the day before had done. Mrs. Hurst and Miss Bingley had spent some hours of the morning with the invalid, who continued, though slowly, to mend; and, in the evening, Elizabeth joined their party in the drawing-room. The loo table, however, did not appear. Mr. Darcy was writing, and Miss Bingley, seated near him, was watching the progress of his letter, and repeatedly calling off his attention by messages to his sister. Mr. Hurst and Mr. Bingley were at piquet, and Mrs. Hurst was observing their game.
```

Source lines 2521-2526:

```text
“You expect me to account for opinions which you choose to call mine, but which I have never acknowledged. Allowing the case, however, to stand according to your representation, you must remember, Miss Bennet, that the friend who is supposed to desire his return to the house, and the delay of his plan, has merely desired it, asked it without offering one argument in favour of its propriety.”
```

Source lines 2676-2678:

```text
She then ran gaily off, rejoicing, as she rambled about, in the hope of being at home again in a day or two. Jane was already so much recovered as to intend leaving her room for a couple of hours that evening.
```

Excluded source blocks in this chapter:

- illustration, source lines 2398-2398

```text
[Illustration]
```

- illustration, source lines 2635-2639

```text
[Illustration: “No, no; stay where you are” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 2683-2687

```text
[Illustration: “Piling up the fire” [_Copyright 1894 by George Allen._]]
```

### Pride and Prejudice: Chapter 14

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-14` (ordinal 14)
- **Expected paragraphs:** 19
- **Parsed paragraphs:** 18
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 3161-3184:

```text
During dinner, Mr. Bennet scarcely spoke at all; but when the servants were withdrawn, he thought it time to have some conversation with his guest, and therefore started a subject in which he expected him to shine, by observing that he seemed very fortunate in his patroness. Lady Catherine de Bourgh’s attention to his wishes, and consideration for his comfort, appeared very remarkable. Mr. Bennet could not have chosen better. Mr. Collins was eloquent in her praise. The subject elevated him to more than usual solemnity of manner; and with a most important aspect he protested that he had never in his life witnessed such behaviour in a person of rank--such affability and condescension, as he had himself experienced from Lady Catherine. She had been graciously pleased to approve of both the discourses which he had already had the honour of preaching before her. She had also asked him twice to dine at Rosings, and had sent for him only the Saturday before, to make up her pool of quadrille in the evening. Lady Catherine was reckoned proud by many people, he knew, but _he_ had never seen anything but affability in her. She had always spoken to him as she would to any other gentleman; she made not the smallest objection to his joining in the society of the neighbourhood, nor to his leaving his parish occasionally for a week or two to visit his relations. She had even condescended to advise him to marry as soon as he could, provided he chose with discretion; and had once paid him a visit in his humble parsonage, where she had perfectly approved all the alterations he had been making, and had even vouchsafed to suggest some herself,--some shelves in the closets upstairs.
```

Source lines 3226-3229:

```text
“You judge very properly,” said Mr. Bennet; “and it is happy for you that you possess the talent of flattering with delicacy. May I ask whether these pleasing attentions proceed from the impulse of the moment, or are the result of previous study?”
```

Source lines 3274-3282:

```text
Then, turning to Mr. Bennet, he offered himself as his antagonist at backgammon. Mr. Bennet accepted the challenge, observing that he acted very wisely in leaving the girls to their own trifling amusements. Mrs. Bennet and her daughters apologized most civilly for Lydia’s interruption, and promised that it should not occur again, if he would resume his book; but Mr. Collins, after assuring them that he bore his young cousin no ill-will, and should never resent her behaviour as any affront, seated himself at another table with Mr. Bennet, and prepared for backgammon.
```

Excluded source blocks in this chapter:

- illustration, source lines 3159-3159

```text
[Illustration]
```

- illustration, source lines 3246-3250

```text
[Illustration: “Protested that he never read novels” H.T Feb 94 ]
```

- illustration, source lines 3287-3287

```text
[Illustration]
```

### Pride and Prejudice: Chapter 16

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-16` (ordinal 16)
- **Expected paragraphs:** 62
- **Parsed paragraphs:** 60
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 3469-3475:

```text
As no objection was made to the young people’s engagement with their aunt, and all Mr. Collins’s scruples of leaving Mr. and Mrs. Bennet for a single evening during his visit were most steadily resisted, the coach conveyed him and his five cousins at a suitable hour to Meryton; and the girls had the pleasure of hearing, as they entered the drawing-room, that Mr. Wickham had accepted their uncle’s invitation, and was then in the house.
```

Source lines 3662-3663:

```text
Elizabeth honoured him for such feelings, and thought him handsomer than ever as he expressed them.
```

Source lines 3818-3833:

```text
Elizabeth allowed that he had given a very rational account of it, and they continued talking together with mutual satisfaction till supper put an end to cards, and gave the rest of the ladies their share of Mr. Wickham’s attentions. There could be no conversation in the noise of Mrs. Philips’s supper party, but his manners recommended him to everybody. Whatever he said, was said well; and whatever he did, done gracefully. Elizabeth went away with her head full of him. She could think of nothing but of Mr. Wickham, and of what he had told her, all the way home; but there was not time for her even to mention his name as they went, for neither Lydia nor Mr. Collins were once silent. Lydia talked incessantly of lottery tickets, of the fish she had lost and the fish she had won; and Mr. Collins, in describing the civility of Mr. and Mrs. Philips, protesting that he did not in the least regard his losses at whist, enumerating all the dishes at supper, and repeatedly fearing that he crowded his cousins, had more to say than he could well manage before the carriage stopped at Longbourn House.
```

Excluded source blocks in this chapter:

- illustration, source lines 3467-3467

```text
[Illustration]
```

- illustration, source lines 3508-3512

```text
[Illustration: “The officers of the ----shire” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 3838-3841

```text
[Illustration: “delighted to see their dear friend again” ]
```

### Pride and Prejudice: Chapter 18

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-18` (ordinal 18)
- **Expected paragraphs:** 79
- **Parsed paragraphs:** 77
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 3991-4005:

```text
Till Elizabeth entered the drawing-room at Netherfield, and looked in vain for Mr. Wickham among the cluster of red coats there assembled, a doubt of his being present had never occurred to her. The certainty of meeting him had not been checked by any of those recollections that might not unreasonably have alarmed her. She had dressed with more than usual care, and prepared in the highest spirits for the conquest of all that remained unsubdued of his heart, trusting that it was not more than might be won in the course of the evening. But in an instant arose the dreadful suspicion of his being purposely omitted, for Mr. Darcy’s pleasure, in the Bingleys’ invitation to the officers; and though this was not exactly the case, the absolute fact of his absence was pronounced by his friend Mr. Denny, to whom Lydia eagerly applied, and who told them that Wickham had been obliged to go to town on business the day before, and was not yet returned; adding, with a significant smile,--
```

Source lines 4187-4187:

```text
“And what is your success?”
```

Source lines 4516-4524:

```text
Mrs. Bennet was perfectly satisfied; and quitted the house under the delightful persuasion that, allowing for the necessary preparations of settlements, new carriages, and wedding clothes, she should undoubtedly see her daughter settled at Netherfield in the course of three or four months. Of having another daughter married to Mr. Collins she thought with equal certainty, and with considerable, though not equal, pleasure. Elizabeth was the least dear to her of all her children; and though the man and the match were quite good enough for _her_, the worth of each was eclipsed by Mr. Bingley and Netherfield.
```

Excluded source blocks in this chapter:

- illustration, source lines 3989-3989

```text
[Illustration]
```

- illustration, source lines 4131-4136

```text
[Illustration: “Such very superior dancing is not often seen.” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 4529-4532

```text
[Illustration: “to assure you in the most animated language” ]
```

### Pride and Prejudice: Chapter 20

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-20` (ordinal 20)
- **Expected paragraphs:** 36
- **Parsed paragraphs:** 35
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 4741-4751:

```text
Mr. Collins was not left long to the silent contemplation of his successful love; for Mrs. Bennet, having dawdled about in the vestibule to watch for the end of the conference, no sooner saw Elizabeth open the door and with quick step pass her towards the staircase, than she entered the breakfast-room, and congratulated both him and herself in warm terms on the happy prospect of their nearer connection. Mr. Collins received and returned these felicitations with equal pleasure, and then proceeded to relate the particulars of their interview, with the result of which he trusted he had every reason to be satisfied, since the refusal which his cousin had steadfastly given him would naturally flow from her bashful modesty and the genuine delicacy of her character.
```

Source lines 4812-4812:

```text
“I have, sir.”
```

Source lines 4905-4923:

```text
“My dear madam,” replied he, “let us be for ever silent on this point. Far be it from me,” he presently continued, in a voice that marked his displeasure, “to resent the behaviour of your daughter. Resignation to inevitable evils is the duty of us all: the peculiar duty of a young man who has been so fortunate as I have been, in early preferment; and, I trust, I am resigned. Perhaps not the less so from feeling a doubt of my positive happiness had my fair cousin honoured me with her hand; for I have often observed, that resignation is never so perfect as when the blessing denied begins to lose somewhat of its value in our estimation. You will not, I hope, consider me as showing any disrespect to your family, my dear madam, by thus withdrawing my pretensions to your daughter’s favour, without having paid yourself and Mr. Bennet the compliment of requesting you to interpose your authority in my behalf. My conduct may, I fear, be objectionable in having accepted my dismission from your daughter’s lips instead of your own; but we are all liable to error. I have certainly meant well through the whole affair. My object has been to secure an amiable companion for myself, with due consideration for the advantage of all your family; and if my _manner_ has been at all reprehensible, I here beg leave to apologize.”
```

Excluded source blocks in this chapter:

- illustration, source lines 4739-4739

```text
[Illustration]
```

- illustration, source lines 4856-4859

```text
[Illustration: “they entered the breakfast room” ]
```

- illustration, source lines 4928-4928

```text
[Illustration]
```

### Pride and Prejudice: Chapter 22

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-22` (ordinal 22)
- **Expected paragraphs:** 22
- **Parsed paragraphs:** 20
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 5157-5160:

```text
The Bennets were engaged to dine with the Lucases; and again, during the chief of the day, was Miss Lucas so kind as to listen to Mr. Collins. Elizabeth took an opportunity of thanking her. “It keeps him in good humour,” said she, “and I am more obliged to you than I can express.”
```

Source lines 5262-5265:

```text
“You cannot be too much on your guard. Risk anything rather than her displeasure; and if you find it likely to be raised by your coming to us again, which I should think exceedingly probable, stay quietly at home, and be satisfied that _we_ shall take no offence.”
```

Source lines 5319-5332:

```text
Elizabeth quietly answered “undoubtedly;” and, after an awkward pause, they returned to the rest of the family. Charlotte did not stay much longer; and Elizabeth was then left to reflect on what she had heard. It was a long time before she became at all reconciled to the idea of so unsuitable a match. The strangeness of Mr. Collins’s making two offers of marriage within three days was nothing in comparison of his being now accepted. She had always felt that Charlotte’s opinion of matrimony was not exactly like her own; but she could not have supposed it possible that, when called into action, she would have sacrificed every better feeling to worldly advantage. Charlotte, the wife of Mr. Collins, was a most humiliating picture! And to the pang of a friend disgracing herself, and sunk in her esteem, was added the distressing conviction that it was impossible for that friend to be tolerably happy in the lot she had chosen.
```

Excluded source blocks in this chapter:

- illustration, source lines 5155-5155

```text
[Illustration]
```

- illustration, source lines 5202-5206

```text
[Illustration: “So much love and eloquence” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 5337-5341

```text
[Illustration: “Protested he must be entirely mistaken.” [_Copyright 1894 by George Allen._]]
```

### Pride and Prejudice: Chapter 23

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-23` (ordinal 23)
- **Expected paragraphs:** 26
- **Parsed paragraphs:** 25
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 5351-5359:

```text
Elizabeth was sitting with her mother and sisters, reflecting on what she had heard, and doubting whether she was authorized to mention it, when Sir William Lucas himself appeared, sent by his daughter to announce her engagement to the family. With many compliments to them, and much self-gratulation on the prospect of a connection between the houses, he unfolded the matter,--to an audience not merely wondering, but incredulous; for Mrs. Bennet, with more perseverance than politeness, protested he must be entirely mistaken; and Lydia, always unguarded and often uncivil, boisterously exclaimed,--
```

Source lines 5455-5462:

```text
Even Elizabeth began to fear--not that Bingley was indifferent--but that his sisters would be successful in keeping him away. Unwilling as she was to admit an idea so destructive to Jane’s happiness, and so dishonourable to the stability of her lover, she could not prevent its frequently recurring. The united efforts of his two unfeeling sisters, and of his overpowering friend, assisted by the attractions of Miss Darcy and the amusements of London, might be too much, she feared, for the strength of his attachment.
```

Source lines 5523-5523:

```text
“I leave it to yourself to determine,” said Mr. Bennet.
```

Excluded source blocks in this chapter:

- illustration, source lines 5349-5349

```text
[Illustration]
```

- illustration, source lines 5482-5485

```text
[Illustration: “_Whenever she spoke in a low voice_” ]
```

- illustration, source lines 5528-5528

```text
[Illustration]
```

### Pride and Prejudice: Chapter 25

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-25` (ordinal 25)
- **Expected paragraphs:** 22
- **Parsed paragraphs:** 20
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 5750-5758:

```text
After a week spent in professions of love and schemes of felicity, Mr. Collins was called from his amiable Charlotte by the arrival of Saturday. The pain of separation, however, might be alleviated on his side by preparations for the reception of his bride, as he had reason to hope, that shortly after his next return into Hertfordshire, the day would be fixed that was to make him the happiest of men. He took leave of his relations at Longbourn with as much solemnity as before; wished his fair cousins health and happiness again, and promised their father another letter of thanks.
```

Source lines 5839-5840:

```text
Elizabeth was exceedingly pleased with this proposal, and felt persuaded of her sister’s ready acquiescence.
```

Source lines 5899-5909:

```text
Mrs. Gardiner had seen Pemberley, and known the late Mr. Darcy by character perfectly well. Here, consequently, was an inexhaustible subject of discourse. In comparing her recollection of Pemberley with the minute description which Wickham could give, and in bestowing her tribute of praise on the character of its late possessor, she was delighting both him and herself. On being made acquainted with the present Mr. Darcy’s treatment of him, she tried to remember something of that gentleman’s reputed disposition, when quite a lad, which might agree with it; and was confident, at last, that she recollected having heard Mr. Fitzwilliam Darcy formerly spoken of as a very proud, ill-natured boy.
```

Excluded source blocks in this chapter:

- illustration, source lines 5748-5748

```text
[Illustration]
```

- illustration, source lines 5806-5810

```text
[Illustration: “Offended two or three young ladies” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 5914-5917

```text
[Illustration: “Will you come and see me?” ]
```

### Pride and Prejudice: Chapter 26

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-26` (ordinal 26)
- **Expected paragraphs:** 31
- **Parsed paragraphs:** 30
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 5927-5929:

```text
Mrs. Gardiner’s caution to Elizabeth was punctually and kindly given on the first favourable opportunity of speaking to her alone: after honestly telling her what she thought, she thus went on:--
```

Source lines 6004-6005:

```text
“I am not likely to leave Kent for some time. Promise me, therefore, to come to Hunsford.”
```

Source lines 6138-6153:

```text
All this was acknowledged to Mrs. Gardiner; and, after relating the circumstances, she thus went on:--“I am now convinced, my dear aunt, that I have never been much in love; for had I really experienced that pure and elevating passion, I should at present detest his very name, and wish him all manner of evil. But my feelings are not only cordial towards _him_, they are even impartial towards Miss King. I cannot find out that I hate her at all, or that I am in the least unwilling to think her a very good sort of girl. There can be no love in all this. My watchfulness has been effectual; and though I should certainly be a more interesting object to all my acquaintance, were I distractedly in love with him, I cannot say that I regret my comparative insignificance. Importance may sometimes be purchased too dearly. Kitty and Lydia take his defection much more to heart than I do. They are young in the ways of the world, and not yet open to the mortifying conviction that handsome young men must have something to live on as well as the plain.”
```

Excluded source blocks in this chapter:

- illustration, source lines 5925-5925

```text
[Illustration]
```

- illustration, source lines 6158-6161

```text
[Illustration: “On the Stairs” ]
```

### Pride and Prejudice: Chapter 27

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-27` (ordinal 27)
- **Expected paragraphs:** 24
- **Parsed paragraphs:** 23
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 6171-6187:

```text
With no greater events than these in the Longbourn family, and otherwise diversified by little beyond the walks to Meryton, sometimes dirty and sometimes cold, did January and February pass away. March was to take Elizabeth to Hunsford. She had not at first thought very seriously of going thither; but Charlotte, she soon found, was depending on the plan, and she gradually learned to consider it herself with greater pleasure as well as greater certainty. Absence had increased her desire of seeing Charlotte again, and weakened her disgust of Mr. Collins. There was novelty in the scheme; and as, with such a mother and such uncompanionable sisters, home could not be faultless, a little change was not unwelcome for its own sake. The journey would, moreover, give her a peep at Jane; and, in short, as the time drew near, she would have been very sorry for any delay. Everything, however, went on smoothly, and was finally settled according to Charlotte’s first sketch. She was to accompany Sir William and his second daughter. The improvement of spending a night in London was added in time, and the plan became as perfect as plan could be.
```

Source lines 6254-6255:

```text
“But he paid her not the smallest attention till her grandfather’s death made her mistress of this fortune?”
```

Source lines 6294-6305:

```text
No scheme could have been more agreeable to Elizabeth, and her acceptance of the invitation was most ready and grateful. “My dear, dear aunt,” she rapturously cried, “what delight! what felicity! You give me fresh life and vigour. Adieu to disappointment and spleen. What are men to rocks and mountains? Oh, what hours of transport we shall spend! And when we _do_ return, it shall not be like other travellers, without being able to give one accurate idea of anything. We _will_ know where we have gone--we _will_ recollect what we have seen. Lakes, mountains, and rivers, shall not be jumbled together in our imaginations; nor, when we attempt to describe any particular scene, will we begin quarrelling about its relative situation. Let _our_ first effusions be less insupportable than those of the generality of travellers.”
```

Excluded source blocks in this chapter:

- illustration, source lines 6169-6169

```text
[Illustration]
```

- illustration, source lines 6310-6313

```text
[Illustration: “At the door” ]
```

### Pride and Prejudice: Chapter 28

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-28` (ordinal 28)
- **Expected paragraphs:** 23
- **Parsed paragraphs:** 20
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 6323-6326:

```text
Every object in the next day’s journey was new and interesting to Elizabeth; and her spirits were in a state of enjoyment; for she had seen her sister looking so well as to banish all fear for her health, and the prospect of her northern tour was a constant source of delight.
```

Source lines 6423-6428:

```text
About the middle of the next day, as she was in her room getting ready for a walk, a sudden noise below seemed to speak the whole house in confusion; and, after listening a moment, she heard somebody running upstairs in a violent hurry, and calling loudly after her. She opened the door, and met Maria in the landing-place, who, breathless with agitation, cried out,--
```

Source lines 6470-6474:

```text
At length there was nothing more to be said; the ladies drove on, and the others returned into the house. Mr. Collins no sooner saw the two girls than he began to congratulate them on their good fortune, which Charlotte explained by letting them know that the whole party was asked to dine at Rosings the next day.
```

Excluded source blocks in this chapter:

- illustration, source lines 6321-6321

```text
[Illustration]
```

- illustration, source lines 6430-6434

```text
[Illustration: “In Conversation with the ladies” [Copyright 1894 by George Allen.]]
```

- illustration, source lines 6479-6483

```text
[Illustration: ‘Lady Catherine, said she, you have given me a treasure.’ [_Copyright 1894 by George Allen._]]
```

### Pride and Prejudice: Chapter 30

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-30` (ordinal 30)
- **Expected paragraphs:** 16
- **Parsed paragraphs:** 13
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 6766-6782:

```text
Sir William stayed only a week at Hunsford; but his visit was long enough to convince him of his daughter’s being most comfortably settled, and of her possessing such a husband and such a neighbour as were not often met with. While Sir William was with them, Mr. Collins devoted his mornings to driving him out in his gig, and showing him the country: but when he went away, the whole family returned to their usual employments, and Elizabeth was thankful to find that they did not see more of her cousin by the alteration; for the chief of the time between breakfast and dinner was now passed by him either at work in the garden, or in reading and writing, and looking out of window in his own book room, which fronted the road. The room in which the ladies sat was backwards. Elizabeth at first had rather wondered that Charlotte should not prefer the dining parlour for common use; it was a better sized room, and had a pleasanter aspect: but she soon saw that her friend had an excellent reason for what she did, for Mr. Collins would undoubtedly have been much less in his own apartment had they sat in one equally lively; and she gave Charlotte credit for the arrangement.
```

Source lines 6845-6847:

```text
His arrival was soon known at the Parsonage; for Mr. Collins was walking the whole morning within view of the lodges opening into Hunsford Lane, in order to have
```

Source lines 6889-6894:

```text
She was perfectly sensible that he never had: but she wished to see whether he would betray any consciousness of what had passed between the Bingleys and Jane; and she thought he looked a little confused as he answered that he had never been so fortunate as to meet Miss Bennet. The subject was pursued no further, and the gentlemen soon afterwards went away.
```

Excluded source blocks in this chapter:

- illustration, source lines 6764-6764

```text
[Illustration]
```

- illustration, source lines 6812-6815

```text
[Illustration: “he never failed to inform them” ]
```

- illustration, source lines 6849-6853

```text
[Illustration: “The gentlemen accompanied him.” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 6899-6902

```text
[Illustration: “At Church” ]
```

### Pride and Prejudice: Chapter 34

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-34` (ordinal 34)
- **Expected paragraphs:** 32
- **Parsed paragraphs:** 31
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 7495-7511:

```text
When they were gone, Elizabeth, as if intending to exasperate herself as much as possible against Mr. Darcy, chose for her employment the examination of all the letters which Jane had written to her since her being in Kent. They contained no actual complaint, nor was there any revival of past occurrences, or any communication of present suffering. But in all, and in almost every line of each, there was a want of that cheerfulness which had been used to characterize her style, and which, proceeding from the serenity of a mind at ease with itself, and kindly disposed towards everyone, had been scarcely ever clouded. Elizabeth noticed every sentence conveying the idea of uneasiness, with an attention which it had hardly received on the first perusal. Mr. Darcy’s shameful boast of what misery he had been able to inflict gave her a keener sense of her sister’s sufferings. It was some consolation to think that his visit to Rosings was to end on the day after the next, and a still greater that in less than a fortnight she should herself be with Jane again, and enabled to contribute to the recovery of her spirits, by all that affection could do.
```

Source lines 7617-7618:

```text
Elizabeth disdained the appearance of noticing this civil reflection, but its meaning did not escape, nor was it likely to conciliate her.
```

Source lines 7707-7709:

```text
She continued in very agitating reflections till the sound of Lady Catherine’s carriage made her feel how unequal she was to encounter Charlotte’s observation, and hurried her away to her room.
```

Excluded source blocks in this chapter:

- illustration, source lines 7493-7493

```text
[Illustration]
```

- illustration, source lines 7714-7717

```text
[Illustration: “Hearing herself called” ]
```

### Pride and Prejudice: Chapter 36

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-36` (ordinal 36)
- **Expected paragraphs:** 16
- **Parsed paragraphs:** 14
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 7992-8009:

```text
Elizabeth, when Mr. Darcy gave her the letter, did not expect it to contain a renewal of his offers, she had formed no expectation at all of its contents. But such as they were, it may be well supposed how eagerly she went through them, and what a contrariety of emotion they excited. Her feelings as she read were scarcely to be defined. With amazement did she first understand that he believed any apology to be in his power; and steadfastly was she persuaded, that he could have no explanation to give, which a just sense of shame would not conceal. With a strong prejudice against everything he might say, she began his account of what had happened at Netherfield. She read with an eagerness which hardly left her power of comprehension; and from impatience of knowing what the next sentence might bring, was incapable of attending to the sense of the one before her eyes. His belief of her sister’s insensibility she instantly resolved to be false; and his account of the real, the worst objections to the match, made her too angry to have any wish of doing him justice. He expressed no regret for what he had done which satisfied her; his style was not penitent, but haughty. It was all pride and insolence.
```

Source lines 8127-8129:

```text
She grew absolutely ashamed of herself. Of neither Darcy nor Wickham could she think, without feeling that she had been blind, partial, prejudiced, absurd.
```

Source lines 8179-8185:

```text
She was immediately told, that the two gentlemen from Rosings had each called during her absence; Mr. Darcy, only for a few minutes, to take leave, but that Colonel Fitzwilliam had been sitting with them at least an hour, hoping for her return, and almost resolving to walk after her till she could be found. Elizabeth could but just _affect_ concern in missing him; she really rejoiced at it. Colonel Fitzwilliam was no longer an object. She could think only of her letter.
```

Excluded source blocks in this chapter:

- illustration, source lines 7990-7990

```text
[Illustration]
```

- illustration, source lines 8056-8060

```text
[Illustration: “Meeting accidentally in Town” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 8190-8193

```text
[Illustration: “His parting obeisance” ]
```

### Pride and Prejudice: Chapter 37

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-37` (ordinal 37)
- **Expected paragraphs:** 22
- **Parsed paragraphs:** 20
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 8203-8211:

```text
The two gentlemen left Rosings the next morning; and Mr. Collins having been in waiting near the lodges, to make them his parting obeisance, was able to bring home the pleasing intelligence of their appearing in very good health, and in as tolerable spirits as could be expected, after the melancholy scene so lately gone through at Rosings. To Rosings he then hastened to console Lady Catherine and her daughter; and on his return brought back, with great satisfaction, a message from her Ladyship, importing that she felt herself so dull as to make her very desirous of having them all to dine with her.
```

Source lines 8266-8267:

```text
“You are all kindness, madam; but I believe we must abide by our original plan.”
```

Source lines 8346-8349:

```text
When they parted, Lady Catherine, with great condescension, wished them a good journey, and invited them to come to Hunsford again next year; and Miss de Bourgh exerted herself so far as to courtesy and hold out her hand to both.
```

Excluded source blocks in this chapter:

- illustration, source lines 8201-8201

```text
[Illustration]
```

- illustration, source lines 8251-8255

```text
[Illustration: “Dawson” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 8354-8357

```text
[Illustration: “The elevation of his feelings.” ]
```

### Pride and Prejudice: Chapter 38

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-38` (ordinal 38)
- **Expected paragraphs:** 19
- **Parsed paragraphs:** 17
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 8367-8369:

```text
On Saturday morning Elizabeth and Mr. Collins met for breakfast a few minutes before the others appeared; and he took the opportunity of paying the parting civilities which he deemed indispensably necessary.
```

Source lines 8443-8445:

```text
“But,” he added, “you will of course wish to have your humble respects delivered to them, with your grateful thanks for their kindness to you while you have been here.”
```

Source lines 8470-8479:

```text
It was not without an effort, meanwhile, that she could wait even for Longbourn, before she told her sister of Mr. Darcy’s proposals. To know that she had the power of revealing what would so exceedingly astonish Jane, and must, at the same time, so highly gratify whatever of her own vanity she had not yet been able to reason away, was such a temptation to openness as nothing could have conquered, but the state of indecision in which she remained as to the extent of what she should communicate, and her fear, if she once entered on the subject, of being hurried into repeating something of Bingley, which might only grieve her sister further.
```

Excluded source blocks in this chapter:

- illustration, source lines 8365-8365

```text
[Illustration]
```

- illustration, source lines 8438-8441

```text
[Illustration: “They had forgotten to leave any message” ]
```

- illustration, source lines 8484-8487

```text
[Illustration: “How nicely we are crammed in” ]
```

### Pride and Prejudice: Chapter 40

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-40` (ordinal 40)
- **Expected paragraphs:** 37
- **Parsed paragraphs:** 35
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 8670-8674:

```text
Elizabeth’s impatience to acquaint Jane with what had happened could no longer be overcome; and at length resolving to suppress every particular in which her sister was concerned, and preparing her to be surprised, she related to her the next morning the chief of the scene between Mr. Darcy and herself.
```

Source lines 8747-8748:

```text
“Lizzy, when you first read that letter, I am sure you could not treat the matter as you do now.”
```

Source lines 8852-8855:

```text
“No; it would have been strange if they had. But I make no doubt they often talk of it between themselves. Well, if they can be easy with an estate that is not lawfully their own, so much the better. _I_ should be ashamed of having one that was only entailed on me.”
```

Excluded source blocks in this chapter:

- illustration, source lines 8668-8668

```text
[Illustration]
```

- illustration, source lines 8819-8822

```text
[Illustration: “I am determined never to speak of it again” ]
```

- illustration, source lines 8860-8864

```text
[Illustration: “When Colonel Miller’s regiment went away” [_Copyright 1894 by George Allen._]]
```

### Pride and Prejudice: Chapter 41

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-41` (ordinal 41)
- **Expected paragraphs:** 42
- **Parsed paragraphs:** 40
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 8874-8881:

```text
The first week of their return was soon gone. The second began. It was the last of the regiment’s stay in Meryton, and all the young ladies in the neighbourhood were drooping apace. The dejection was almost universal. The elder Miss Bennets alone were still able to eat, drink, and sleep, and pursue the usual course of their employments. Very frequently were they reproached for this insensibility by Kitty and Lydia, whose own misery was extreme, and who could not comprehend such hard-heartedness in any of the family.
```

Source lines 8993-8998:

```text
With this answer Elizabeth was forced to be content; but her own opinion continued the same, and she left him disappointed and sorry. It was not in her nature, however, to increase her vexations by dwelling on them. She was confident of having performed her duty; and to fret over unavoidable evils, or augment them by anxiety, was no part of her disposition.
```

Source lines 9111-9120:

```text
When the party broke up, Lydia returned with Mrs. Forster to Meryton, from whence they were to set out early the next morning. The separation between her and her family was rather noisy than pathetic. Kitty was the only one who shed tears; but she did weep from vexation and envy. Mrs. Bennet was diffuse in her good wishes for the felicity of her daughter, and impressive in her injunctions that she would not miss the opportunity of enjoying herself as much as possible,--advice which there was every reason to believe would be attended to; and, in the clamorous happiness of Lydia herself in bidding farewell, the more gentle adieus of her sisters were uttered without being heard.
```

Excluded source blocks in this chapter:

- illustration, source lines 8872-8872

```text
[Illustration]
```

- illustration, source lines 9012-9016

```text
[Illustration: “Tenderly flirting” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 9125-9129

```text
[Illustration: The arrival of the Gardiners ]
```

### Pride and Prejudice: Chapter 42

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-42` (ordinal 42)
- **Expected paragraphs:** 19
- **Parsed paragraphs:** 18
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 9139-9155:

```text
Had Elizabeth’s opinion been all drawn from her own family, she could not have formed a very pleasing picture of conjugal felicity or domestic comfort. Her father, captivated by youth and beauty, and that appearance of good-humour which youth and beauty generally give, had married a woman whose weak understanding and illiberal mind had very early in their marriage put an end to all real affection for her. Respect, esteem, and confidence had vanished for ever; and all his views of domestic happiness were overthrown. But Mr. Bennet was not of a disposition to seek comfort for the disappointment which his own imprudence had brought on in any of those pleasures which too often console the unfortunate for their folly or their vice. He was fond of the country and of books; and from these tastes had arisen his principal enjoyments. To his wife he was very little otherwise indebted than as her ignorance and folly had contributed to his amusement. This is not the sort of happiness which a man would in general wish to owe to his wife; but where other powers of entertainment are wanting, the true philosopher will derive benefit from such as are given.
```

Source lines 9251-9258:

```text
The period of expectation was now doubled. Four weeks were to pass away before her uncle and aunt’s arrival. But they did pass away, and Mr. and Mrs. Gardiner, with their four children, did at length appear at Longbourn. The children, two girls of six and eight years old, and two younger boys, were to be left under the particular care of their cousin Jane, who was the general favourite, and whose steady sense and sweetness of temper exactly adapted her for attending to them in every way--teaching them, playing with them, and loving them.
```

Source lines 9315-9315:

```text
To Pemberley, therefore, they were to go.
```

Excluded source blocks in this chapter:

- illustration, source lines 9137-9137

```text
[Illustration]
```

- illustration, source lines 9320-9323

```text
[Illustration: “Conjecturing as to the date” ]
```

### Pride and Prejudice: Chapter 44

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-44` (ordinal 44)
- **Expected paragraphs:** 20
- **Parsed paragraphs:** 18
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 9851-9873:

```text
Elizabeth had settled it that Mr. Darcy would bring his sister to visit her the very day after her reaching Pemberley; and was, consequently, resolved not to be out of sight of the inn the whole of that morning. But her conclusion was false; for on the very morning after their own arrival at Lambton these visitors came. They had been walking about the place with some of their new friends, and were just returned to the inn to dress themselves for dining with the same family, when the sound of a carriage drew them to a window, and they saw a gentleman and lady in a curricle driving up the street. Elizabeth, immediately recognizing the livery, guessed what it meant, and imparted no small degree of surprise to her relations, by acquainting them with the honour which she expected. Her uncle and aunt were all amazement; and the embarrassment of her manner as she spoke, joined to the circumstance itself, and many of the circumstances of the preceding day, opened to them a new idea on the business. Nothing had ever suggested it before, but they now felt that there was no other way of accounting for such attentions from such a quarter than by supposing a partiality for their niece. While these newly-born notions were passing in their heads, the perturbation of Elizabeth’s feelings was every moment increasing. She was quite amazed at her own discomposure; but, amongst other causes of disquiet, she dreaded lest the partiality of the brother should have said too much in her favour; and, more than commonly anxious to please, she naturally suspected that every power of pleasing would fail her.
```

Source lines 9954-9973:

```text
It was not often that she could turn her eyes on Mr. Darcy himself; but whenever she did catch a glimpse she saw an expression of general complaisance, and in all that he said, she heard an accent so far removed from _hauteur_ or disdain of his companions, as convinced her that the improvement of manners which she had yesterday witnessed, however temporary its existence might prove, had at least outlived one day. When she saw him thus seeking the acquaintance, and courting the good opinion of people with whom any intercourse a few months ago would have been a disgrace; when she saw him thus civil, not only to herself, but to the very relations whom he had openly disdained, and recollected their last lively scene in Hunsford Parsonage, the difference, the change was so great, and struck so forcibly on her mind, that she could hardly restrain her astonishment from being visible. Never, even in the company of his dear friends at Netherfield, or his dignified relations at Rosings, had she seen him so desirous to please, so free from self-consequence or unbending reserve, as now, when no importance could result from the success of his endeavours, and when even the acquaintance of those to whom his attentions were addressed, would draw down the ridicule and censure of the ladies both of Netherfield and Rosings.
```

Source lines 10068-10070:

```text
Mr. Gardiner left them soon after breakfast. The fishing scheme had been renewed the day before, and a positive engagement made of his meeting some of the gentlemen at Pemberley by noon.
```

Excluded source blocks in this chapter:

- illustration, source lines 9849-9849

```text
[Illustration]
```

- illustration, source lines 9923-9927

```text
[Illustration: “To make herself agreeable to all” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 10075-10078

```text
[Illustration: “Engaged by the river” ]
```

### Pride and Prejudice: Chapter 46

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-46` (ordinal 46)
- **Expected paragraphs:** 34
- **Parsed paragraphs:** 32
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 10273-10279:

```text
Elizabeth had been a good deal disappointed in not finding a letter from Jane on their first arrival at Lambton; and this disappointment had been renewed on each of the mornings that had now been spent there; but on the third her repining was over, and her sister justified, by the receipt of two letters from her at once, on one of which was marked that it had been mis-sent elsewhere. Elizabeth was not surprised at it, as Jane had written the direction remarkably ill.
```

Source lines 10433-10433:

```text
“And what has been done, what has been attempted, to recover her?”
```

Source lines 10553-10563:

```text
But wishes were vain; or, at best, could serve only to amuse her in the hurry and confusion of the following hour. Had Elizabeth been at leisure to be idle, she would have remained certain that all employment was impossible to one so wretched as herself; but she had her share of business as well as her aunt, and amongst the rest there were notes to be written to all their friends at Lambton, with false excuses for their sudden departure. An hour, however, saw the whole completed; and Mr. Gardiner, meanwhile, having settled his account at the inn, nothing remained to be done but to go; and Elizabeth, after all the misery of the morning, found herself, in a shorter space of time than she could have supposed, seated in the carriage, and on the road to Longbourn.
```

Excluded source blocks in this chapter:

- illustration, source lines 10271-10271

```text
[Illustration]
```

- illustration, source lines 10405-10408

```text
[Illustration: “I have not an instant to lose” ]
```

- illustration, source lines 10568-10571

```text
[Illustration: “The first pleasing earnest of their welcome” ]
```

### Pride and Prejudice: Chapter 47

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-47` (ordinal 47)
- **Expected paragraphs:** 75
- **Parsed paragraphs:** 74
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 10581-10590:

```text
“I have been thinking it over again, Elizabeth,” said her uncle, as they drove from the town; “and really, upon serious consideration, I am much more inclined than I was to judge as your eldest sister does of the matter. It appears to me so very unlikely that any young man should form such a design against a girl who is by no means unprotected or friendless, and who was actually staying in his Colonel’s family, that I am strongly inclined to hope the best. Could he expect that her friends would not step forward? Could he expect to be noticed again by the regiment, after such an affront to Colonel Forster? His temptation is not adequate to the risk.”
```

Source lines 10805-10817:

```text
“Oh, my dear brother,” replied Mrs. Bennet, “that is exactly what I could most wish for. And now do, when you get to town, find them out, wherever they may be; and if they are not married already, _make_ them marry. And as for wedding clothes, do not let them wait for that, but tell Lydia she shall have as much money as she chooses to buy them, after they are married. And, above all things, keep Mr. Bennet from fighting. Tell him what a dreadful state I am in--that I am frightened out of my wits; and have such tremblings, such flutterings all over me, such spasms in my side, and pains in my head, and such beatings at my heart, that I can get no rest by night nor by day. And tell my dear Lydia not to give any directions about her clothes till she has seen me, for she does not know which are the best warehouses. Oh, brother, how kind you are! I know you will contrive it all.”
```

Source lines 10992-11004:

```text
“He meant, I believe,” replied Jane, “to go to Epsom, the place where they last changed horses, see the postilions, and try if anything could be made out from them. His principal object must be to discover the number of the hackney coach which took them from Clapham. It had come with a fare from London; and as he thought the circumstance of a gentleman and lady’s removing from one carriage into another might be remarked, he meant to make inquiries at Clapham. If he could anyhow discover at what house the coachman had before set down his fare, he determined to make inquiries there, and hoped it might not be impossible to find out the stand and number of the coach. I do not know of any other designs that he had formed; but he was in such a hurry to be gone, and his spirits so greatly discomposed, that I had difficulty in finding out even so much as this.”
```

Excluded source blocks in this chapter:

- illustration, source lines 10579-10579

```text
[Illustration]
```

- illustration, source lines 11009-11012

```text
[Illustration: The Post ]
```

### Pride and Prejudice: Chapter 48

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-48` (ordinal 48)
- **Expected paragraphs:** 36
- **Parsed paragraphs:** 35
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 11022-11028:

```text
The whole party were in hopes of a letter from Mr. Bennet the next morning, but the post came in without bringing a single line from him. His family knew him to be, on all common occasions, a most negligent and dilatory correspondent; but at such a time they had hoped for exertion. They were forced to conclude, that he had no pleasing intelligence to send; but even of _that_ they would have been glad to be certain. Mr. Gardiner had waited only for the letters before he set off.
```

Source lines 11182-11185:

```text
As Mrs. Gardiner began to wish to be at home, it was settled that she and her children should go to London at the same time that Mr. Bennet came from it. The coach, therefore, took them the first stage of their journey, and brought its master back to Longbourn.
```

Source lines 11256-11258:

```text
“Well, well,” said he, “do not make yourself unhappy. If you are a good girl for the next ten years, I will take you to a review at the end of them.”
```

Excluded source blocks in this chapter:

- illustration, source lines 11020-11020

```text
[Illustration]
```

- illustration, source lines 11125-11129

```text
[Illustration: “To whom I have related the affair” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 11263-11263

```text
[Illustration]
```

### Pride and Prejudice: Chapter 49

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-49` (ordinal 49)
- **Expected paragraphs:** 57
- **Parsed paragraphs:** 55
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 11273-11279:

```text
Two days after Mr. Bennet’s return, as Jane and Elizabeth were walking together in the shrubbery behind the house, they saw the housekeeper coming towards them, and concluding that she came to call them to their mother, went forward to meet her; but instead of the expected summons, when they approached her, she said to Miss Bennet, “I beg your pardon, madam, for interrupting you, but I was in hopes you might have got some good news from town, so I took the liberty of coming to ask.”
```

Source lines 11388-11388:

```text
And so saying, he turned back with them, and walked towards the house.
```

Source lines 11523-11530:

```text
Mrs. Hill began instantly to express her joy. Elizabeth received her congratulations amongst the rest, and then, sick of this folly, took refuge in her own room, that she might think with freedom. Poor Lydia’s situation must, at best, be bad enough; but that it was no worse, she had need to be thankful. She felt it so; and though, in looking forward, neither rational happiness, nor worldly prosperity could be justly expected for her sister, in looking back to what they had feared, only two hours ago, she felt all the advantages of what they had gained.
```

Excluded source blocks in this chapter:

- illustration, source lines 11271-11271

```text
[Illustration]
```

- illustration, source lines 11329-11333

```text
[Illustration: “But perhaps you would like to read it” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 11535-11539

```text
[Illustration: “The spiteful old ladies” [_Copyright 1894 by George Allen._]]
```

### Pride and Prejudice: Chapter 50

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-50` (ordinal 50)
- **Expected paragraphs:** 24
- **Parsed paragraphs:** 23
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 11549-11556:

```text
Mr. Bennet had very often wished, before this period of his life, that, instead of spending his whole income, he had laid by an annual sum, for the better provision of his children, and of his wife, if she survived him. He now wished it more than ever. Had he done his duty in that respect, Lydia need not have been indebted to her uncle for whatever of honour or credit could now be purchased for her. The satisfaction of prevailing on one of the most worthless young men in Great Britain to be her husband might then have rested in its proper place.
```

Source lines 11656-11665:

```text
She had no fear of its spreading farther, through his means. There were few people on whose secrecy she would have more confidently depended; but at the same time there was no one whose knowledge of a sister’s frailty would have mortified her so much. Not, however, from any fear of disadvantage from it individually to herself; for at any rate there seemed a gulf impassable between them. Had Lydia’s marriage been concluded on the most honourable terms, it was not to be supposed that Mr. Darcy would connect himself with a family, where to every other objection would now be added an alliance and relationship of the nearest kind with the man whom he so justly scorned.
```

Source lines 11747-11762:

```text
His daughter’s request, for such it might be considered, of being admitted into her family again, before she set off for the north, received at first an absolute negative. But Jane and Elizabeth, who agreed in wishing, for the sake of their sister’s feelings and consequence, that she should be noticed on her marriage by her parents, urged him so earnestly, yet so rationally and so mildly, to receive her and her husband at Longbourn, as soon as they were married, that he was prevailed on to think as they thought, and act as they wished. And their mother had the satisfaction of knowing, that she should be able to show her married daughter in the neighbourhood, before she was banished to the north. When Mr. Bennet wrote again to his brother, therefore, he sent his permission for them to come; and it was settled, that, as soon as the ceremony was over, they should proceed to Longbourn. Elizabeth was surprised, however, that Wickham should consent to such a scheme; and, had she consulted only her own inclination, any meeting with him would have been the last object of her wishes.
```

Excluded source blocks in this chapter:

- illustration, source lines 11547-11547

```text
[Illustration]
```

- illustration, source lines 11767-11771

```text
[Illustration: “With an affectionate smile” [_Copyright 1894 by George Allen._]]
```

### Pride and Prejudice: Chapter 51

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-51` (ordinal 51)
- **Expected paragraphs:** 41
- **Parsed paragraphs:** 40
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 11781-11787:

```text
Their sister’s wedding-day arrived; and Jane and Elizabeth felt for her probably more than she felt for herself. The carriage was sent to meet them at----, and they were to return in it by dinnertime. Their arrival was dreaded by the elder Miss Bennets--and Jane more especially, who gave Lydia the feelings which would have attended herself, had _she_ been the culprit, and was wretched in the thought of what her sister must endure.
```

Source lines 11891-11895:

```text
No one but Mrs. Bennet regretted that their stay would be so short; and she made the most of the time by visiting about with her daughter, and having very frequent parties at home. These parties were acceptable to all; to avoid a family circle was even more desirable to such as did think than such as did not.
```

Source lines 11996-11999:

```text
Jane’s delicate sense of honour would not allow her to speak to Elizabeth privately of what Lydia had let fall; Elizabeth was glad of it:--till it appeared whether her inquiries would receive any satisfaction, she had rather be without a confidante.
```

Excluded source blocks in this chapter:

- illustration, source lines 11779-11779

```text
[Illustration]
```

- illustration, source lines 12004-12007

```text
[Illustration: “I am sure she did not listen.” ]
```

### Pride and Prejudice: Chapter 52

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-52` (ordinal 52)
- **Expected paragraphs:** 40
- **Parsed paragraphs:** 39
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 12017-12022:

```text
Elizabeth had the satisfaction of receiving an answer to her letter as soon as she possibly could. She was no sooner in possession of it, than hurrying into the little copse, where she was least likely to be interrupted, she sat down on one of the benches, and prepared to be happy; for the length of the letter convinced her that it did not contain a denial.
```

Source lines 12259-12260:

```text
“I was surprised to see Darcy in town last month. We passed each other several times. I wonder what he can be doing there.”
```

Source lines 12320-12321:

```text
She held out her hand: he kissed it with affectionate gallantry, though he hardly knew how to look, and they entered the house.
```

Excluded source blocks in this chapter:

- illustration, source lines 12015-12015

```text
[Illustration]
```

- illustration, source lines 12326-12329

```text
[Illustration: “Mr. Darcy with him.” ]
```

### Pride and Prejudice: Chapter 53

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-53` (ordinal 53)
- **Expected paragraphs:** 61
- **Parsed paragraphs:** 60
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 12339-12342:

```text
Mr. Wickham was so perfectly satisfied with this conversation, that he never again distressed himself, or provoked his dear sister Elizabeth, by introducing the subject of it; and she was pleased to find that she had said enough to keep him quiet.
```

Source lines 12480-12483:

```text
Her daughters were eagerly called to partake of her joy. Jane resolutely kept her place at the table; but Elizabeth, to satisfy her mother, went to the window--she looked--she saw Mr. Darcy with him, and sat down again by her sister.
```

Source lines 12647-12651:

```text
Mrs. Bennet had been strongly inclined to ask them to stay and dine there that day; but, though she always kept a very good table, she did not think anything less than two courses could be good enough for a man on whom she had such anxious designs, or satisfy the appetite and pride of one who had ten thousand a year.
```

Excluded source blocks in this chapter:

- illustration, source lines 12337-12337

```text
[Illustration]
```

- illustration, source lines 12656-12659

```text
[Illustration: “Jane happened to look round” ]
```

### Pride and Prejudice: Chapter 54

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-54` (ordinal 54)
- **Expected paragraphs:** 37
- **Parsed paragraphs:** 35
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 12669-12672:

```text
As soon as they were gone, Elizabeth walked out to recover her spirits; or, in other words, to dwell without interruption on those subjects which must deaden them more. Mr. Darcy’s behaviour astonished and vexed her.
```

Source lines 12762-12765:

```text
Darcy had walked away to another part of the room. She followed him with her eyes, envied everyone to whom he spoke, had scarcely patience enough to help anybody to coffee, and then was enraged against herself for being so silly!
```

Source lines 12848-12851:

```text
“That is a question which I hardly know how to answer. We all love to instruct, though we can teach only what is not worth knowing. Forgive me; and if you persist in indifference, do not make _me_ your confidante.”
```

Excluded source blocks in this chapter:

- illustration, source lines 12667-12667

```text
[Illustration]
```

- illustration, source lines 12816-12819

```text
[Illustration: “M^{rs}. Long and her nieces.” ]
```

- illustration, source lines 12856-12859

```text
[Illustration: “Lizzy, my dear, I want to speak to you.” ]
```

### Pride and Prejudice: Chapter 56

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-56` (ordinal 56)
- **Expected paragraphs:** 78
- **Parsed paragraphs:** 76
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 13149-13161:

```text
One morning, about a week after Bingley’s engagement with Jane had been formed, as he and the females of the family were sitting together in the dining-room, their attention was suddenly drawn to the window by the sound of a carriage; and they perceived a chaise and four driving up the lawn. It was too early in the morning for visitors; and besides, the equipage did not answer to that of any of their neighbours. The horses were post; and neither the carriage, nor the livery of the servant who preceded it, were familiar to them. As it was certain, however, that somebody was coming, Bingley instantly prevailed on Miss Bennet to avoid the confinement of such an intrusion, and walk away with him into the shrubbery. They both set off; and the conjectures of the remaining three continued, though with little satisfaction, till the door was thrown open, and their visitor entered. It was Lady Catherine de Bourgh.
```

Source lines 13306-13307:

```text
“But you are not entitled to know _mine_; nor will such behaviour as this ever induce me to be explicit.”
```

Source lines 13479-13480:

```text
Elizabeth was forced to give in to a little falsehood here; for to acknowledge the substance of their conversation was impossible.
```

Excluded source blocks in this chapter:

- illustration, source lines 13147-13147

```text
[Illustration]
```

- illustration, source lines 13234-13238

```text
[Illustration: “After a short survey” [_Copyright 1894 by George Allen._]]
```

- illustration, source lines 13485-13488

```text
[Illustration: “But now it comes out” ]
```

### Pride and Prejudice: Chapter 57

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-57` (ordinal 57)
- **Expected paragraphs:** 22
- **Parsed paragraphs:** 21
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 13498-13513:

```text
The discomposure of spirits which this extraordinary visit threw Elizabeth into could not be easily overcome; nor could she for many hours learn to think of it less than incessantly. Lady Catherine, it appeared, had actually taken the trouble of this journey from Rosings for the sole purpose of breaking off her supposed engagement with Mr. Darcy. It was a rational scheme, to be sure! but from what the report of their engagement could originate, Elizabeth was at a loss to imagine; till she recollected that _his_ being the intimate friend of Bingley, and _her_ being the sister of Jane, was enough, at a time when the expectation of one wedding made everybody eager for another, to supply the idea. She had not herself forgotten to feel that the marriage of her sister must bring them more frequently together. And her neighbours at Lucas Lodge, therefore, (for through their communication with the Collinses, the report, she concluded, had reached Lady Catherine,) had only set _that_ down as almost certain and immediate which _she_ had looked forward to as possible at some future time.
```

Source lines 13568-13572:

```text
The colour now rushed into Elizabeth’s cheeks in the instantaneous conviction of its being a letter from the nephew, instead of the aunt; and she was undetermined whether most to be pleased that he explained himself at all, or offended that his letter was not rather addressed to herself, when her father continued,--
```

Source lines 13653-13660:

```text
To this question his daughter replied only with a laugh; and as it had been asked without the least suspicion, she was not distressed by his repeating it. Elizabeth had never been more at a loss to make her feelings appear what they were not. It was necessary to laugh when she would rather have cried. Her father had most cruelly mortified her by what he said of Mr. Darcy’s indifference; and she could do nothing but wonder at such a want of penetration, or fear that, perhaps, instead of his seeing too _little_, she might have fancied too _much_.
```

Excluded source blocks in this chapter:

- illustration, source lines 13496-13496

```text
[Illustration]
```

- illustration, source lines 13665-13669

```text
[Illustration: “The efforts of his aunt” [_Copyright 1894 by George Allen._]]
```

### Pride and Prejudice: Chapter 58

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-58` (ordinal 58)
- **Expected paragraphs:** 47
- **Parsed paragraphs:** 46
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 13679-13691:

```text
Instead of receiving any such letter of excuse from his friend, as Elizabeth half expected Mr. Bingley to do, he was able to bring Darcy with him to Longbourn before many days had passed after Lady Catherine’s visit. The gentlemen arrived early; and, before Mrs. Bennet had time to tell him of their having seen his aunt, of which her daughter sat in momentary dread, Bingley, who wanted to be alone with Jane, proposed their all walking out. It was agreed to. Mrs. Bennet was not in the habit of walking, Mary could never spare time, but the remaining five set off together. Bingley and Jane, however, soon allowed the others to outstrip them. They lagged behind, while Elizabeth, Kitty, and Darcy were to entertain each other. Very little was said by either; Kitty was too much afraid of him to talk; Elizabeth was secretly forming a desperate resolution; and, perhaps, he might be doing the same.
```

Source lines 13826-13845:

```text
“I cannot give you credit for any philosophy of the kind. _Your_ retrospections must be so totally void of reproach, that the contentment arising from them is not of philosophy, but, what is much better, of ignorance. But with _me_, it is not so. Painful recollections will intrude, which cannot, which ought not to be repelled. I have been a selfish being all my life, in practice, though not in principle. As a child I was taught what was _right_, but I was not taught to correct my temper. I was given good principles, but left to follow them in pride and conceit. Unfortunately an only son (for many years an only _child_), I was spoiled by my parents, who, though good themselves, (my father particularly, all that was benevolent and amiable,) allowed, encouraged, almost taught me to be selfish and overbearing, to care for none beyond my own family circle, to think meanly of all the rest of the world, to _wish_ at least to think meanly of their sense and worth compared with my own. Such I was, from eight to eight-and-twenty; and such I might still have been but for you, dearest, loveliest Elizabeth! What do I not owe you! You taught me a lesson, hard indeed at first, but most advantageous. By you, I was properly humbled. I came to you without a doubt of my reception. You showed me how insufficient were all my pretensions to please a woman worthy of being pleased.”
```

Source lines 13934-13940:

```text
Elizabeth longed to observe that Mr. Bingley had been a most delightful friend; so easily guided that his worth was invaluable; but she checked herself. She remembered that he had yet to learn to be laughed at, and it was rather too early to begin. In anticipating the happiness of Bingley, which of course was to be inferior only to his own, he continued the conversation till they reached the house. In the hall they parted.
```

Excluded source blocks in this chapter:

- illustration, source lines 13677-13677

```text
[Illustration]
```

- illustration, source lines 13945-13949

```text
[Illustration: “Unable to utter a syllable” [_Copyright 1894 by George Allen._]]
```

### Pride and Prejudice: Chapter 59

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-59` (ordinal 59)
- **Expected paragraphs:** 49
- **Parsed paragraphs:** 48
- **Result:** PARAGRAPH COUNT MISMATCH

Retained source blocks sampled from this chapter:

Source lines 13959-13964:

```text
“My dear Lizzy, where can you have been walking to?” was a question which Elizabeth received from Jane as soon as she entered the room, and from all the others when they sat down to table. She had only to say in reply, that they had wandered about till she was beyond her own knowledge. She coloured as she spoke; but neither that, nor anything else, awakened a suspicion of the truth.
```

Source lines 14072-14075:

```text
Kitty owned that she had rather stay at home. Darcy professed a great curiosity to see the view from the Mount, and Elizabeth silently consented. As she went upstairs to get ready, Mrs. Bennet followed her, saying,--
```

Source lines 14221-14223:

```text
“I admire all my three sons-in-law highly,” said he. “Wickham, perhaps, is my favourite; but I think I shall like _your_ husband quite as well as Jane’s.”
```

Excluded source blocks in this chapter:

- illustration, source lines 13957-13957

```text
[Illustration]
```

- illustration, source lines 14228-14232

```text
[Illustration: “The obsequious civility.” [_Copyright 1894 by George Allen._]]
```

## Database and FTS validation

Not run because source parsing or reference-count validation failed.

## Warnings

None.
