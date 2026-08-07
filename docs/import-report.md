# Jane Austen Database Import Report

## Execution status

- **Status:** PARSER AUDIT REQUIRED
- **Generated:** 2026-08-07T18:44:41.107Z
- **Configured books:** 6
- **Books processed:** 6
- **Published database:** No

## Failure

```text
Parsed reference counts differ in 62 chapter(s); database was not published.
```

## Book totals

| Book | Chapters E/P | Paragraphs E/P | Sentences E/P | Characters | Character aliases | Locations | Location aliases |
|---|---:|---:|---:|---:|---:|---:|---:|
| Emma (`emma`) | 55/55 | 2319/2319 | 7121/7120 | 33 | 26 | 22 | 0 |
| Mansfield Park (`mansfield-park`) | 48/48 | 1792/1792 | 6665/6669 | 30 | 27 | 20 | 0 |
| Northanger Abbey (`northanger-abbey`) | 31/31 | 1021/1021 | 3220/3219 | 21 | 18 | 20 | 0 |
| Persuasion (`persuasion`) | 24/24 | 1010/1010 | 3562/3562 | 30 | 26 | 30 | 0 |
| Pride and Prejudice (`pride-and-prejudice`) | 61/61 | 2121/2121 | 5899/5904 | 48 | 58 | 49 | 7 |
| Sense and Sensibility (`sense-and-sensibility`) | 50/50 | 1809/1809 | 4898/4881 | 30 | 29 | 28 | 0 |

## Chapter-level discrepancies

### Emma: Volume I, Chapter I

- **Book:** `emma`
- **Chapter:** `chapter-1` (ordinal 1)
- **Expected paragraphs:** 47
- **Parsed paragraphs:** 47
- **Expected sentences:** 158
- **Parsed sentences:** 159
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Sixteen years had Miss Taylor been in Mr. Woodhouse’s family, less as a governess than a friend, very fond of both daughters, but particularly of Emma. Between _them_ it was more the intimacy of sisters. Even before Miss Taylor had ceased …
```

```text
“My dearest papa! You do not think I could mean _you_, or suppose Mr. Knightley to mean _you_. What a horrible idea! Oh no! I meant only myself. Mr. Knightley loves to find fault with me, you know—in a joke—it is all a joke. We always say …
```

```text
“With a great deal of pleasure, sir, at any time,” said Mr. Knightley, laughing, “and I agree with you entirely, that it will be a much better thing. Invite him to dinner, Emma, and help him to the best of the fish and the chicken, but lea…
```

### Emma: Volume I, Chapter XI

- **Book:** `emma`
- **Chapter:** `chapter-11` (ordinal 11)
- **Expected paragraphs:** 28
- **Parsed paragraphs:** 28
- **Expected sentences:** 86
- **Parsed sentences:** 85
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Mr. Elton must now be left to himself. It was no longer in Emma’s power to superintend his happiness or quicken his measures. The coming of her sister’s family was so very near at hand, that first in anticipation, and then in reality, it b…
```

```text
“Just as it should be,” said Mr. John Knightley, “and just as I hoped it was from your letters. Her wish of shewing you attention could not be doubted, and his being a disengaged and social man makes it all easy. I have been always telling…
```

```text
Emma could not like what bordered on a reflection on Mr. Weston, and had half a mind to take it up; but she struggled, and let it pass. She would keep the peace if possible; and there was something honourable and valuable in the strong dom…
```

### Emma: Volume I, Chapter XII

- **Book:** `emma`
- **Chapter:** `chapter-12` (ordinal 12)
- **Expected paragraphs:** 62
- **Parsed paragraphs:** 62
- **Expected sentences:** 144
- **Parsed sentences:** 143
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Mr. Knightley was to dine with them—rather against the inclination of Mr. Woodhouse, who did not like that any one should share with him in Isabella’s first day. Emma’s sense of right however had decided it; and besides the consideration o…
```

```text
“No, I do not know that Mr. Wingfield considers it _very_ sickly except—
```

```text
Mr. Woodhouse was rather agitated by such harsh reflections on his friend Perry, to whom he had, in fact, though unconsciously, been attributing many of his own feelings and expressions;—but the soothing attentions of his daughters gradual…
```

### Emma: Volume I, Chapter XIII

- **Book:** `emma`
- **Chapter:** `chapter-13` (ordinal 13)
- **Expected paragraphs:** 46
- **Parsed paragraphs:** 46
- **Expected sentences:** 105
- **Parsed sentences:** 106
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
There could hardly be a happier creature in the world than Mrs. John Knightley, in this short visit to Hartfield, going about every morning among her old acquaintance with her five children, and talking over what she had done every evening…
```

```text
“Yes,” said Mr. John Knightley presently, with some slyness, “he seems to have a great deal of good-will towards you.”
```

```text
“We are sure of excellent fires,” continued he, “and every thing in the greatest comfort. Charming people, Mr. and Mrs. Weston;—Mrs. Weston indeed is much beyond praise, and he is exactly what one values, so hospitable, and so fond of soci…
```

### Emma: Volume I, Chapter XVIII

- **Book:** `emma`
- **Chapter:** `chapter-18` (ordinal 18)
- **Expected paragraphs:** 38
- **Parsed paragraphs:** 38
- **Expected sentences:** 112
- **Parsed sentences:** 111
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Mr. Frank Churchill did not come. When the time proposed drew near, Mrs. Weston’s fears were justified in the arrival of a letter of excuse. For the present, he could not be spared, to his “very great mortification and regret; but still he…
```

```text
“There is one thing, Emma, which a man can always do, if he chuses, and that is, his duty; not by manoeuvring and finessing, but by vigour and resolution. It is Frank Churchill’s duty to pay this attention to his father. He knows it to be …
```

```text
“He is a person I never think of from one month’s end to another,” said Mr. Knightley, with a degree of vexation, which made Emma immediately talk of something else, though she could not comprehend why he should be angry.
```

### Emma: Volume II, Chapter I

- **Book:** `emma`
- **Chapter:** `chapter-19` (ordinal 19)
- **Expected paragraphs:** 33
- **Parsed paragraphs:** 33
- **Expected sentences:** 116
- **Parsed sentences:** 115
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Emma and Harriet had been walking together one morning, and, in Emma’s opinion, had been talking enough of Mr. Elton for that day. She could not think that Harriet’s solace or her own sins required more; and she was therefore industriously…
```

```text
At this moment, an ingenious and animating suspicion entering Emma’s brain with regard to Jane Fairfax, this charming Mr. Dixon, and the not going to Ireland, she said, with the insidious design of farther discovery,
```

```text
“I am afraid we must be running away,” said Emma, glancing at Harriet, and beginning to rise—“My father will be expecting us. I had no intention, I thought I had no power of staying more than five minutes, when I first entered the house. I…
```

### Emma: Volume II, Chapter IV

- **Book:** `emma`
- **Chapter:** `chapter-22` (ordinal 22)
- **Expected paragraphs:** 14
- **Parsed paragraphs:** 14
- **Expected sentences:** 51
- **Parsed sentences:** 50
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
A week had not passed since Miss Hawkins’s name was first mentioned in Highbury, before she was, by some means or other, discovered to have every recommendation of person and mind; to be handsome, elegant, highly accomplished, and perfectl…
```

```text
The wedding was no distant event, as the parties had only themselves to please, and nothing but the necessary preparations to wait for; and when he set out for Bath again, there was a general expectation, which a certain glance of Mrs. Col…
```

```text
Had it been allowable entertainment, had there been no pain to her friend, or reproach to herself, in the waverings of Harriet’s mind, Emma would have been amused by its variations. Sometimes Mr. Elton predominated, sometimes the Martins; …
```

### Emma: Volume II, Chapter V

- **Book:** `emma`
- **Chapter:** `chapter-23` (ordinal 23)
- **Expected paragraphs:** 49
- **Parsed paragraphs:** 49
- **Expected sentences:** 118
- **Parsed sentences:** 119
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Small heart had Harriet for visiting. Only half an hour before her friend called for her at Mrs. Goddard’s, her evil stars had led her to the very spot where, at that moment, a trunk, directed to _The Rev. Philip Elton, White-Hart, Bath_, …
```

```text
“I told you yesterday,” cried Mr. Weston with exultation, “I told you all that he would be here before the time named. I remembered what I used to do myself. One cannot creep upon a journey; one cannot help getting on faster than one has p…
```

```text
Mr. Frank Churchill still declined it, looking as serious as he could, and his father gave his hearty support by calling out, “My good friend, this is quite unnecessary; Frank knows a puddle of water when he sees it, and as to Mrs. Bates’s…
```

### Emma: Volume II, Chapter IX

- **Book:** `emma`
- **Chapter:** `chapter-27` (ordinal 27)
- **Expected paragraphs:** 53
- **Parsed paragraphs:** 53
- **Expected sentences:** 171
- **Parsed sentences:** 166
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
“Oh! if I could but play as well as you and Miss Fairfax!”
```

```text
“Should I send it to Mrs. Goddard’s, ma’am?” asked Mrs. Ford.—“Yes—no—yes, to Mrs. Goddard’s. Only my pattern gown is at Hartfield. No, you shall send it to Hartfield, if you please. But then, Mrs. Goddard will want to see it.—And I could …
```

```text
“Pray take care, Mrs. Weston, there is a step at the turning. Pray take care, Miss Woodhouse, ours is rather a dark staircase—rather darker and narrower than one could wish. Miss Smith, pray take care. Miss Woodhouse, I am quite concerned,…
```

### Emma: Volume II, Chapter X

- **Book:** `emma`
- **Chapter:** `chapter-28` (ordinal 28)
- **Expected paragraphs:** 55
- **Parsed paragraphs:** 55
- **Expected sentences:** 135
- **Parsed sentences:** 133
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
The appearance of the little sitting-room as they entered, was tranquillity itself; Mrs. Bates, deprived of her usual employment, slumbering on one side of the fire, Frank Churchill, at a table near her, most deedily occupied about her spe…
```

```text
“Oh! dear, Kingston—are you?—Mrs. Cole was saying the other day she wanted something from Kingston.”
```

```text
Emma found it really time to be at home; the visit had already lasted long; and on examining watches, so much of the morning was perceived to be gone, that Mrs. Weston and her companion taking leave also, could allow themselves only to wal…
```

### Emma: Volume II, Chapter XIV

- **Book:** `emma`
- **Chapter:** `chapter-32` (ordinal 32)
- **Expected paragraphs:** 61
- **Parsed paragraphs:** 61
- **Expected sentences:** 211
- **Parsed sentences:** 212
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Mrs. Elton was first seen at church: but though devotion might be interrupted, curiosity could not be satisfied by a bride in a pew, and it must be left for the visits in form which were then to be paid, to settle whether she were very pre…
```

```text
She restrained herself, however, from any of the reproofs she could have given, and only thanked Mrs. Elton coolly; “but their going to Bath was quite out of the question; and she was not perfectly convinced that the place might suit her b…
```

```text
Emma had done. Her father was growing nervous, and could not understand _her_. Her mind returned to Mrs. Elton’s offences, and long, very long, did they occupy her.
```

### Emma: Volume III, Chapter VII

- **Book:** `emma`
- **Chapter:** `chapter-43` (ordinal 43)
- **Expected paragraphs:** 63
- **Parsed paragraphs:** 63
- **Expected sentences:** 220
- **Parsed sentences:** 223
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
They had a very fine day for Box Hill; and all the other outward circumstances of arrangement, accommodation, and punctuality, were in favour of a pleasant party. Mr. Weston directed the whole, officiating safely between Hartfield and the …
```

```text
“I doubt its being very clever myself,” said Mr. Weston. “It is too much a matter of fact, but here it is.—What two letters of the alphabet are there, that express perfection?”
```

```text
“Oh!” cried Emma, “I know there is not a better creature in the world: but you must allow, that what is good and what is ridiculous are most unfortunately blended in her.”
```

### Emma: Volume III, Chapter X

- **Book:** `emma`
- **Chapter:** `chapter-46` (ordinal 46)
- **Expected paragraphs:** 69
- **Parsed paragraphs:** 69
- **Expected sentences:** 171
- **Parsed sentences:** 172
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
One morning, about ten days after Mrs. Churchill’s decease, Emma was called downstairs to Mr. Weston, who “could not stay five minutes, and wanted particularly to speak with her.”—He met her at the parlour-door, and hardly asking her how s…
```

```text
Mrs. Weston kissed her with tears of joy; and when she could find utterance, assured her, that this protestation had done her more good than any thing else in the world could do.
```

```text
“A very pretty trick you have been playing me, upon my word! This was a device, I suppose, to sport with my curiosity, and exercise my talent of guessing. But you really frightened me. I thought you had lost half your property, at least. A…
```

### Emma: Volume III, Chapter XI

- **Book:** `emma`
- **Chapter:** `chapter-47` (ordinal 47)
- **Expected paragraphs:** 50
- **Parsed paragraphs:** 50
- **Expected sentences:** 152
- **Parsed sentences:** 154
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
“Harriet, poor Harriet!”—Those were the words; in them lay the tormenting ideas which Emma could not get rid of, and which constituted the real misery of the business to her. Frank Churchill had behaved very ill by herself—very ill in many…
```

```text
“Good God!” cried Emma, “this has been a most unfortunate—most deplorable mistake!—What is to be done?”
```

```text
How Harriet could ever have had the presumption to raise her thoughts to Mr. Knightley!—How she could dare to fancy herself the chosen of such a man till actually assured of it!—But Harriet was less humble, had fewer scruples than formerly…
```

### Emma: Volume III, Chapter XVI

- **Book:** `emma`
- **Chapter:** `chapter-52` (ordinal 52)
- **Expected paragraphs:** 59
- **Parsed paragraphs:** 59
- **Expected sentences:** 126
- **Parsed sentences:** 127
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
She had no difficulty in procuring Isabella’s invitation; and she was fortunate in having a sufficient reason for asking it, without resorting to invention.—There was a tooth amiss. Harriet really wished, and had wished some time, to consu…
```

```text
“Oh! no, it is a meeting at the Crown, a regular meeting. Weston and Cole will be there too; but one is apt to speak only of those who lead.—I fancy Mr. E. and Knightley have every thing their own way.”
```

```text
“Thank you, thank you.—This is just what I wanted to be assured of.—Oh! if you knew how much I love every thing that is decided and open!—Good-bye, good-bye.”
```

### Mansfield Park: Chapter III

- **Book:** `mansfield-park`
- **Chapter:** `chapter-3` (ordinal 3)
- **Expected paragraphs:** 64
- **Parsed paragraphs:** 64
- **Expected sentences:** 170
- **Parsed sentences:** 171
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
The first event of any importance in the family was the death of Mr. Norris, which happened when Fanny was about fifteen, and necessarily introduced alterations and novelties. Mrs. Norris, on quitting the Parsonage, removed first to the Pa…
```

```text
Mrs. Norris almost started. “Live with me, dear Lady Bertram! what do you mean?”
```

```text
The Miss Bertrams were much to be pitied on the occasion: not for their sorrow, but for their want of it. Their father was no object of love to them; he had never seemed the friend of their pleasures, and his absence was unhappily most wel…
```

### Mansfield Park: Chapter XXI

- **Book:** `mansfield-park`
- **Chapter:** `chapter-21` (ordinal 21)
- **Expected paragraphs:** 34
- **Parsed paragraphs:** 34
- **Expected sentences:** 136
- **Parsed sentences:** 137
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Edmund did not wonder that such should be his father’s feelings, nor could he regret anything but the exclusion of the Grants. “But they,” he observed to Fanny, “have a claim. They seem to belong to us; they seem to be part of ourselves. I…
```

```text
With solemn kindness Sir Thomas addressed her: told her his fears, inquired into her wishes, entreated her to be open and sincere, and assured her that every inconvenience should be braved, and the connexion entirely given up, if she felt …
```

```text
Julia was to go with them to Brighton. Since rivalry between the sisters had ceased, they had been gradually recovering much of their former good understanding; and were at least sufficiently friends to make each of them exceedingly glad t…
```

### Mansfield Park: Chapter XXII

- **Book:** `mansfield-park`
- **Chapter:** `chapter-22` (ordinal 22)
- **Expected paragraphs:** 51
- **Parsed paragraphs:** 51
- **Expected sentences:** 152
- **Parsed sentences:** 151
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Fanny’s consequence increased on the departure of her cousins. Becoming, as she then did, the only young woman in the drawing-room, the only occupier of that interesting division of a family in which she had hitherto held so humble a third…
```

```text
“I grant you the name is good in itself, and _Lord_ Edmund or _Sir_ Edmund sound delightfully; but sink it under the chill, the annihilation of a Mr., and Mr. Edmund is no more than Mr. John or Mr. Thomas. Well, shall we join and disappoin…
```

```text
“Very well, very well,” cried Dr. Grant, “all the better; I am glad to hear you have anything so good in the house. But Miss Price and Mr. Edmund Bertram, I dare say, would take their chance. We none of us want to hear the bill of fare. A …
```

### Mansfield Park: Chapter XXIV

- **Book:** `mansfield-park`
- **Chapter:** `chapter-24` (ordinal 24)
- **Expected paragraphs:** 23
- **Parsed paragraphs:** 23
- **Expected sentences:** 100
- **Parsed sentences:** 99
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
“Phoo! phoo! This is only because there were no tall women to compare her with, and because she has got a new gown, and you never saw her so well dressed before. She is just what she was in October, believe me. The truth is, that she was t…
```

```text
Excepting the moments of peculiar delight, which any marked or unlooked-for instance of Edmund’s consideration of her in the last few months had excited, Fanny had never known so much felicity in her life, as in this unchecked, equal, fear…
```

```text
The wish was rather eager than lasting. He was roused from the reverie of retrospection and regret produced by it, by some inquiry from Edmund as to his plans for the next day’s hunting; and he found it was as well to be a man of fortune a…
```

### Mansfield Park: Chapter XXV

- **Book:** `mansfield-park`
- **Chapter:** `chapter-25` (ordinal 25)
- **Expected paragraphs:** 66
- **Parsed paragraphs:** 66
- **Expected sentences:** 191
- **Parsed sentences:** 193
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
The intercourse of the two families was at this period more nearly restored to what it had been in the autumn, than any member of the old intimacy had thought ever likely to be again. The return of Henry Crawford, and the arrival of Willia…
```

```text
Henry Crawford was in the first glow of another scheme about Thornton Lacey; and not being able to catch Edmund’s ear, was detailing it to his fair neighbour with a look of considerable earnestness. His scheme was to rent the house himself…
```

```text
Fanny’s last feeling in the visit was disappointment: for the shawl which Edmund was quietly taking from the servant to bring and put round her shoulders was seized by Mr. Crawford’s quicker hand, and she was obliged to be indebted to his …
```

### Mansfield Park: Chapter XLIV

- **Book:** `mansfield-park`
- **Chapter:** `chapter-44` (ordinal 44)
- **Expected paragraphs:** 15
- **Parsed paragraphs:** 15
- **Expected sentences:** 164
- **Parsed sentences:** 165
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
“My Dear Fanny,—Excuse me that I have not written before. Crawford told me that you were wishing to hear from me, but I found it impossible to write from London, and persuaded myself that you would understand my silence. Could I have sent …
```

```text
Everybody at all addicted to letter-writing, without having much to say, which will include a large proportion of the female world at least, must feel with Lady Bertram that she was out of luck in having such a capital piece of Mansfield n…
```

```text
So long divided and so differently situated, the ties of blood were little more than nothing. An attachment, originally as tranquil as their tempers, was now become a mere name. Mrs. Price did quite as much for Lady Bertram as Lady Bertram…
```

### Mansfield Park: Chapter XLV

- **Book:** `mansfield-park`
- **Chapter:** `chapter-45` (ordinal 45)
- **Expected paragraphs:** 16
- **Parsed paragraphs:** 16
- **Expected sentences:** 118
- **Parsed sentences:** 119
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
It astonished her that Tom’s sisters could be satisfied with remaining in London at such a time, through an illness which had now, under different degrees of danger, lasted several weeks. _They_ might return to Mansfield when they chose; t…
```

```text
“Forgive me, my dear Fanny, as soon as you can, for my long silence, and behave as if you could forgive me directly. This is my modest request and expectation, for you are so good, that I depend upon being treated better than I deserve, an…
```

```text
Fanny’s disgust at the greater part of this letter, with her extreme reluctance to bring the writer of it and her cousin Edmund together, would have made her (as she felt) incapable of judging impartially whether the concluding offer might…
```

### Northanger Abbey: Chapter 3

- **Book:** `northanger-abbey`
- **Chapter:** `chapter-3` (ordinal 3)
- **Expected paragraphs:** 52
- **Parsed paragraphs:** 52
- **Expected sentences:** 89
- **Parsed sentences:** 88
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Every morning now brought its regular duties—shops were to be visited; some new part of the town to be looked at; and the Pump-room to be attended, where they paraded up and down for an hour, looking at everybody and speaking to no one. Th…
```

```text
They were interrupted by Mrs. Allen: “My dear Catherine,” said she, “do take this pin out of my sleeve; I am afraid it has torn a hole already; I shall be quite sorry if it has, for this is a favourite gown, though it cost but nine shillin…
```

```text
[1] Vide a letter from Mr. Richardson, No. 97, Vol. ii, Rambler.
```

### Northanger Abbey: Chapter 7

- **Book:** `northanger-abbey`
- **Chapter:** `chapter-7` (ordinal 7)
- **Expected paragraphs:** 54
- **Parsed paragraphs:** 54
- **Expected sentences:** 100
- **Parsed sentences:** 101
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
“Oh, these odious gigs!” said Isabella, looking up. “How I detest them.” But this detestation, though so just, was of short duration, for she looked again and exclaimed, “Delightful! mr. Morland and my brother!”
```

```text
“A third indeed! no, no; I did not come to Bath to drive my sisters about; that would be a good joke, faith! morland must take care of you.”
```

```text
Inquiries and communications concerning brothers and sisters, the situation of some, the growth of the rest, and other family matters now passed between them, and continued, with only one small digression on James’s part, in praise of Miss…
```

### Northanger Abbey: Chapter 8

- **Book:** `northanger-abbey`
- **Chapter:** `chapter-8` (ordinal 8)
- **Expected paragraphs:** 38
- **Parsed paragraphs:** 38
- **Expected sentences:** 108
- **Parsed sentences:** 109
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
The dancing began within a few minutes after they were seated; and James, who had been engaged quite as long as his sister, was very importunate with Isabella to stand up; but John was gone into the card-room to speak to a friend, and noth…
```

```text
“Look at that young lady with the white beads round her head,” whispered Catherine, detaching her friend from James. “It is Mr. Tilney’s sister.”
```

```text
Again Catherine excused herself; and at last he walked off to quiz his sisters by himself. The rest of the evening she found very dull; Mr. Tilney was drawn away from their party at tea, to attend that of his partner; Miss Tilney, though b…
```

### Northanger Abbey: Chapter 9

- **Book:** `northanger-abbey`
- **Chapter:** `chapter-9` (ordinal 9)
- **Expected paragraphs:** 51
- **Parsed paragraphs:** 51
- **Expected sentences:** 133
- **Parsed sentences:** 131
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
The progress of Catherine’s unhappiness from the events of the evening was as follows. It appeared first in a general dissatisfaction with everybody about her, while she remained in the rooms, which speedily brought on considerable wearine…
```

```text
“Good heavens!” cried Catherine, quite frightened. “Then pray let us turn back; they will certainly meet with an accident if we go on. Do let us turn back, Mr. Thorpe; stop and speak to my brother, and tell him how very unsafe it is.”
```

```text
Catherine inquired no further; she had heard enough to feel that Mrs. Allen had no real intelligence to give, and that she was most particularly unfortunate herself in having missed such a meeting with both brother and sister. Could she ha…
```

### Northanger Abbey: Chapter 12

- **Book:** `northanger-abbey`
- **Chapter:** `chapter-12` (ordinal 12)
- **Expected paragraphs:** 24
- **Parsed paragraphs:** 24
- **Expected sentences:** 79
- **Parsed sentences:** 78
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
“Mrs. Allen,” said Catherine the next morning, “will there be any harm in my calling on Miss Tilney to-day? I shall not be easy till I have explained everything.”
```

```text
“Me! i take offence!”
```

```text
Here Catherine, who was much less gratified by his admiration than by General Tilney’s, was not sorry to be called away by Mr. Allen. Thorpe, however, would see her to her chair, and, till she entered it, continued the same kind of delicat…
```

### Northanger Abbey: Chapter 17

- **Book:** `northanger-abbey`
- **Chapter:** `chapter-17` (ordinal 17)
- **Expected paragraphs:** 13
- **Parsed paragraphs:** 13
- **Expected sentences:** 53
- **Parsed sentences:** 54
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
The Allens had now entered on the sixth week of their stay in Bath; and whether it should be the last was for some time a question, to which Catherine listened with a beating heart. To have her acquaintance with the Tilneys end so soon was…
```

```text
Northanger Abbey! these were thrilling words, and wound up Catherine’s feelings to the highest point of ecstasy. Her grateful and gratified heart could hardly restrain its expressions within the language of tolerable calmness. To receive s…
```

```text
The circumstances of the morning had led Catherine’s feelings through the varieties of suspense, security, and disappointment; but they were now safely lodged in perfect bliss; and with spirits elated to rapture, with Henry at her heart, a…
```

### Northanger Abbey: Chapter 20

- **Book:** `northanger-abbey`
- **Chapter:** `chapter-20` (ordinal 20)
- **Expected paragraphs:** 28
- **Parsed paragraphs:** 28
- **Expected sentences:** 91
- **Parsed sentences:** 90
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Mr. and Mrs. Allen were sorry to lose their young friend, whose good humour and cheerfulness had made her a valuable companion, and in the promotion of whose enjoyment their own had been gently increased. Her happiness in going with Miss T…
```

```text
“How fearfully will you examine the furniture of your apartment! and what will you discern? Not tables, toilettes, wardrobes, or drawers, but on one side perhaps the remains of a broken lute, on the other a ponderous chest which no efforts…
```

```text
The General, perceiving how her eye was employed, began to talk of the smallness of the room and simplicity of the furniture, where everything, being for daily use, pretended only to comfort, etc.; flattering himself, however, that there w…
```

### Northanger Abbey: Chapter 25

- **Book:** `northanger-abbey`
- **Chapter:** `chapter-25` (ordinal 25)
- **Expected paragraphs:** 42
- **Parsed paragraphs:** 42
- **Expected sentences:** 139
- **Parsed sentences:** 140
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Charming as were all Mrs. Radcliffe’s works, and charming even as were the works of all her imitators, it was not in them perhaps that human nature, at least in the Midland counties of England, was to be looked for. Of the Alps and Pyrenee…
```

```text
“Our brother! frederick!”
```

```text
“That is the most unpromising circumstance, the strongest presumption against him. When I think of his past declarations, I give him up. Moreover, I have too good an opinion of Miss Thorpe’s prudence to suppose that she would part with one…
```

### Persuasion: Chapter XV

- **Book:** `persuasion`
- **Chapter:** `chapter-15` (ordinal 15)
- **Expected paragraphs:** 24
- **Parsed paragraphs:** 24
- **Expected sentences:** 124
- **Parsed sentences:** 125
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Anne entered it with a sinking heart, anticipating an imprisonment of many months, and anxiously saying to herself, “Oh! when shall I leave you again?” A degree of unexpected cordiality, however, in the welcome she received, did her good. …
```

```text
“How is Mary looking?” said Sir Walter, in the height of his good humour. “The last time I saw her she had a red nose, but I hope that may not happen every day.”
```

```text
It was the same, the very same man, with no difference but of dress. Anne drew a little back, while the others received his compliments, and her sister his apologies for calling at so unusual an hour, but “he could not be so near without w…
```

### Persuasion: Chapter XVIII

- **Book:** `persuasion`
- **Chapter:** `chapter-18` (ordinal 18)
- **Expected paragraphs:** 54
- **Parsed paragraphs:** 54
- **Expected sentences:** 245
- **Parsed sentences:** 246
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
“What is this?” cried Sir Walter. “The Crofts have arrived in Bath? The Crofts who rent Kellynch? What have they brought you?”
```

```text
Anne was too much engaged with Lady Russell to be often walking herself; but it so happened that one morning, about a week or ten days after the Croft’s arrival, it suited her best to leave her friend, or her friend’s carriage, in the lowe…
```

```text
“Poor Frederick!” said he at last. “Now he must begin all over again with somebody else. I think we must get him to Bath. Sophy must write, and beg him to come to Bath. Here are pretty girls enough, I am sure. It would be of no use to go t…
```

### Persuasion: Chapter XXI

- **Book:** `persuasion`
- **Chapter:** `chapter-21` (ordinal 21)
- **Expected paragraphs:** 104
- **Parsed paragraphs:** 104
- **Expected sentences:** 373
- **Parsed sentences:** 372
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
“The Ibbotsons, were they there? and the two new beauties, with the tall Irish officer, who is talked of for one of them.”
```

```text
“I beg your pardon, my dear Miss Elliot,” she cried, in her natural tone of cordiality, “I beg your pardon for the short answers I have been giving you, but I have been uncertain what I ought to do. I have been doubting and considering as …
```

```text
“Colonel Wallis! you are acquainted with him?”
```

### Persuasion: Chapter XXII

- **Book:** `persuasion`
- **Chapter:** `chapter-22` (ordinal 22)
- **Expected paragraphs:** 70
- **Parsed paragraphs:** 70
- **Expected sentences:** 276
- **Parsed sentences:** 275
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
“Oh!” cried Elizabeth, “I have been rather too much used to the game to be soon overcome by a gentleman’s hints. However, when I found how excessively he was regretting that he should miss my father this morning, I gave way immediately, fo…
```

```text
“Good heavens, Charles! how can you think of such a thing? Take a box for to-morrow night! Have you forgot that we are engaged to Camden Place to-morrow night? and that we were most particularly asked to meet Lady Dalrymple and her daughte…
```

```text
“Oh! dear! very true. Only think, Miss Elliot, to my great surprise I met with Mr Elliot in Bath Street. I was never more astonished. He turned back and walked with me to the Pump Yard. He had been prevented setting off for Thornberry, but…
```

### Pride and Prejudice: Chapter 25

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-25` (ordinal 25)
- **Expected paragraphs:** 22
- **Parsed paragraphs:** 22
- **Expected sentences:** 75
- **Parsed sentences:** 76
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
After a week spent in professions of love and schemes of felicity, Mr. Collins was called from his amiable Charlotte by the arrival of Saturday. The pain of separation, however, might be alleviated on his side by preparations for the recep…
```

```text
“But that expression of ‘violently in love’ is so hackneyed, so doubtful, so indefinite, that it gives me very little idea. It is as often applied to feelings which arise only from a half hour’s acquaintance, as to a real, strong attachmen…
```

```text
Mrs. Gardiner had seen Pemberley, and known the late Mr. Darcy by character perfectly well. Here, consequently, was an inexhaustible subject of discourse. In comparing her recollection of Pemberley with the minute description which Wickham…
```

### Pride and Prejudice: Chapter 28

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-28` (ordinal 28)
- **Expected paragraphs:** 23
- **Parsed paragraphs:** 22
- **Expected sentences:** 67
- **Parsed sentences:** 66
- **Result:** PARAGRAPH COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
At length the Parsonage was discernible. The garden sloping to the road, the house standing in it, the green pales and the laurel hedge, everything declared they were arriving. Mr. Collins and Charlotte appeared at the door, and the carria…
```

```text
“Oh, my dear Eliza! pray make haste and come into the dining-room, for there is such a sight to be seen! I will not tell you what it is. Make haste, and come down this moment.”
```

```text
At length there was nothing more to be said; the ladies drove on, and the others returned into the house. Mr. Collins no sooner saw the two girls than he began to congratulate them on their good fortune, which Charlotte explained by lettin…
```

### Pride and Prejudice: Chapter 37

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-37` (ordinal 37)
- **Expected paragraphs:** 22
- **Parsed paragraphs:** 22
- **Expected sentences:** 70
- **Parsed sentences:** 71
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
The two gentlemen left Rosings the next morning; and Mr. Collins having been in waiting near the lodges, to make them his parting obeisance, was able to bring home the pleasing intelligence of their appearing in very good health, and in as…
```

```text
“Why, at that rate, you will have been here only six weeks. I expected you to stay two months. I told Mrs. Collins so before you came. There can be no occasion for your going so soon. Mrs. Bennet could certainly spare you for another fortn…
```

```text
Anxiety on Jane’s behalf was another prevailing concern; and Mr. Darcy’s explanation, by restoring Bingley to all her former good opinion, heightened the sense of what Jane had lost. His affection was proved to have been sincere, and his c…
```

### Pride and Prejudice: Chapter 51

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-51` (ordinal 51)
- **Expected paragraphs:** 41
- **Parsed paragraphs:** 41
- **Expected sentences:** 108
- **Parsed sentences:** 109
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
They came. The family were assembled in the breakfast-room to receive them. Smiles decked the face of Mrs. Bennet, as the carriage drove up to the door; her husband looked impenetrably grave; her daughters, alarmed, anxious, uneasy.
```

```text
Their visitors were not to remain above ten days with them. Mr. Wickham had received his commission before he left London, and he was to join his regiment at the end of a fortnight.
```

```text
But to live in ignorance on such a point was impossible; or at least it was impossible not to try for information. Mr. Darcy had been at her sister’s wedding. It was exactly a scene, and exactly among people, where he had apparently least …
```

### Pride and Prejudice: Chapter 52

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-52` (ordinal 52)
- **Expected paragraphs:** 40
- **Parsed paragraphs:** 40
- **Expected sentences:** 168
- **Parsed sentences:** 169
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
“I have just received your letter, and shall devote this whole morning to answering it, as I foresee that a _little_ writing will not comprise what I have to tell you. I must confess myself surprised by your application; I did not expect i…
```

```text
“I do not know. Mrs. Bennet and Lydia are going in the carriage to Meryton. And so, my dear sister, I find, from our uncle and aunt, that you have actually seen Pemberley.”
```

```text
“Mr. Darcy with him.” ]
```

### Pride and Prejudice: Chapter 53

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-53` (ordinal 53)
- **Expected paragraphs:** 61
- **Parsed paragraphs:** 61
- **Expected sentences:** 159
- **Parsed sentences:** 158
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Mr. Wickham was so perfectly satisfied with this conversation, that he never again distressed himself, or provoked his dear sister Elizabeth, by introducing the subject of it; and she was pleased to find that she had said enough to keep hi…
```

```text
“La!” replied Kitty, “it looks just like that man that used to be with him before. Mr. what’s his name--that tall, proud man.”
```

```text
Mrs. Bennet had been strongly inclined to ask them to stay and dine there that day; but, though she always kept a very good table, she did not think anything less than two courses could be good enough for a man on whom she had such anxious…
```

### Pride and Prejudice: Chapter 54

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-54` (ordinal 54)
- **Expected paragraphs:** 37
- **Parsed paragraphs:** 37
- **Expected sentences:** 94
- **Parsed sentences:** 96
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
As soon as they were gone, Elizabeth walked out to recover her spirits; or, in other words, to dwell without interruption on those subjects which must deaden them more. Mr. Darcy’s behaviour astonished and vexed her.
```

```text
The gentlemen came; and she thought he looked as if he would have answered her hopes; but, alas! the ladies had crowded round the table, where Miss Bennet was making tea, and Elizabeth pouring out the coffee, in so close a confederacy, tha…
```

```text
Mrs. Bennet, in short, was in very great spirits: she had seen enough of Bingley’s behaviour to Jane to be convinced that she would get him at last; and her expectations of advantage to her family, when in a happy humour, were so far beyon…
```

### Pride and Prejudice: Chapter 57

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-57` (ordinal 57)
- **Expected paragraphs:** 22
- **Parsed paragraphs:** 22
- **Expected sentences:** 77
- **Parsed sentences:** 76
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
The discomposure of spirits which this extraordinary visit threw Elizabeth into could not be easily overcome; nor could she for many hours learn to think of it less than incessantly. Lady Catherine, it appeared, had actually taken the trou…
```

```text
“Something very much to the purpose, of course. He begins with congratulations on the approaching nuptials of my eldest daughter, of which, it seems, he has been told by some of the good-natured, gossiping Lucases. I shall not sport with y…
```

```text
To this question his daughter replied only with a laugh; and as it had been asked without the least suspicion, she was not distressed by his repeating it. Elizabeth had never been more at a loss to make her feelings appear what they were n…
```

### Pride and Prejudice: Chapter 59

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-59` (ordinal 59)
- **Expected paragraphs:** 49
- **Parsed paragraphs:** 49
- **Expected sentences:** 159
- **Parsed sentences:** 160
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
“My dear Lizzy, where can you have been walking to?” was a question which Elizabeth received from Jane as soon as she entered the room, and from all the others when they sat down to table. She had only to say in reply, that they had wander…
```

```text
During their walk, it was resolved that Mr. Bennet’s consent should be asked in the course of the evening: Elizabeth reserved to herself the application for her mother’s. She could not determine how her mother would take it; sometimes doub…
```

```text
Elizabeth had the satisfaction of seeing her father taking pains to get acquainted with him; and Mr. Bennet soon assured her that he was rising every hour in his esteem.
```

### Pride and Prejudice: Chapter 61

- **Book:** `pride-and-prejudice`
- **Chapter:** `chapter-61` (ordinal 61)
- **Expected paragraphs:** 14
- **Parsed paragraphs:** 15
- **Expected sentences:** 44
- **Parsed sentences:** 45
- **Result:** PARAGRAPH COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Happy for all her maternal feelings was the day on which Mrs. Bennet got rid of her two most deserving daughters. With what delighted pride she afterwards visited Mrs. Bingley, and talked of Mrs. Darcy, may be guessed. I wish I could say, …
```

```text
Kitty, to her very material advantage, spent the chief of her time with her two elder sisters. In society so superior to what she had generally known, her improvement was great. She was not of so ungovernable a temper as Lydia; and, remove…
```

```text
“Yours,” etc.
```

### Sense and Sensibility: Chapter IX

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-9` (ordinal 9)
- **Expected paragraphs:** 32
- **Parsed paragraphs:** 32
- **Expected sentences:** 77
- **Parsed sentences:** 75
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Their visitors, except those from Barton Park, were not many; for, in spite of Sir John's urgent entreaties that they would mix more in the neighbourhood, and repeated assurances of his carriage being always at their service, the independe…
```

```text
"And is that all you can say for him?" cried Marianne, indignantly. "But what are his manners on more intimate acquaintance? What his pursuits, his talents, and genius?"
```

```text
"Ay, you will make conquests enough, I dare say, one way or other. Poor Brandon! he is quite smitten already, and he is very well worth setting your cap at, I can tell you, in spite of all this tumbling about and spraining of ankles."
```

### Sense and Sensibility: Chapter XIII

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-13` (ordinal 13)
- **Expected paragraphs:** 77
- **Parsed paragraphs:** 77
- **Expected sentences:** 126
- **Parsed sentences:** 125
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
"What is the matter with Brandon?" said Sir John.
```

```text
"I can guess what his business is, however," said Mrs. Jennings exultingly.
```

```text
She blushed at this hint; but it was even visibly gratifying to her; and after a ten minutes' interval of earnest thought, she came to her sister again, and said with great good humour, "Perhaps, Elinor, it _was_ rather ill-judged in me to…
```

### Sense and Sensibility: Chapter XIV

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-14` (ordinal 14)
- **Expected paragraphs:** 22
- **Parsed paragraphs:** 22
- **Expected sentences:** 66
- **Parsed sentences:** 65
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
The sudden termination of Colonel Brandon's visit at the park, with his steadiness in concealing its cause, filled the mind, and raised the wonder of Mrs. Jennings for two or three days; she was a great wonderer, as every one must be who t…
```

```text
Mrs. Dashwood looked with pleasure at Marianne, whose fine eyes were fixed so expressively on Willoughby, as plainly denoted how well she understood him.
```

```text
"Shall we see you tomorrow to dinner?" said Mrs. Dashwood, when he was leaving them. "I do not ask you to come in the morning, for we must walk to the park, to call on Lady Middleton."
```

### Sense and Sensibility: Chapter XV

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-15` (ordinal 15)
- **Expected paragraphs:** 47
- **Parsed paragraphs:** 47
- **Expected sentences:** 137
- **Parsed sentences:** 136
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Mrs. Dashwood's visit to Lady Middleton took place the next day, and two of her daughters went with her; but Marianne excused herself from being of the party, under some trifling pretext of employment; and her mother, who concluded that a …
```

```text
"I have only to add, my dear Willoughby, that at Barton cottage you will always be welcome; for I will not press you to return here immediately, because you only can judge how far _that_ might be pleasing to Mrs. Smith; and on this head I …
```

```text
"I hope not, I believe not," cried Elinor. "I love Willoughby, sincerely love him; and suspicion of his integrity cannot be more painful to yourself than to me. It has been involuntary, and I will not encourage it. I was startled, I confes…
```

### Sense and Sensibility: Chapter XVII

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-17` (ordinal 17)
- **Expected paragraphs:** 50
- **Parsed paragraphs:** 50
- **Expected sentences:** 106
- **Parsed sentences:** 105
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Mrs. Dashwood was surprised only for a moment at seeing him; for his coming to Barton was, in her opinion, of all things the most natural. Her joy and expression of regard long outlived her wonder. He received the kindest welcome from her;…
```

```text
"Hunters!" repeated Edward; "but why must you have hunters? Every body does not hunt."
```

```text
"Why should you think so!" replied he, with a sigh. "But gaiety never was a part of _my_ character."
```

### Sense and Sensibility: Chapter XVIII

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-18` (ordinal 18)
- **Expected paragraphs:** 31
- **Parsed paragraphs:** 31
- **Expected sentences:** 74
- **Parsed sentences:** 75
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
The subject was continued no farther; and Marianne remained thoughtfully silent, till a new object suddenly engaged her attention. She was sitting by Edward, and in taking his tea from Mrs. Dashwood, his hand passed so directly before her,…
```

```text
"Who? why yourselves, and the Careys, and Whitakers to be sure. What! you thought nobody could dance because a certain person that shall be nameless is gone!"
```

```text
"I do not doubt it," replied he, rather astonished at her earnestness and warmth; for had he not imagined it to be a joke for the good of her acquaintance in general, founded only on a something or a nothing between Mr. Willoughby and hers…
```

### Sense and Sensibility: Chapter XIX

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-19` (ordinal 19)
- **Expected paragraphs:** 42
- **Parsed paragraphs:** 42
- **Expected sentences:** 131
- **Parsed sentences:** 132
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Edward remained a week at the cottage; he was earnestly pressed by Mrs. Dashwood to stay longer; but, as if he were bent only on self-mortification, he seemed resolved to be gone when his enjoyment among his friends was at the height. His …
```

```text
"Mr. Palmer does not hear me," said she, laughing; "he never does sometimes. It is so ridiculous!"
```

```text
"Why should they ask us?" said Marianne, as soon as they were gone. "The rent of this cottage is said to be low; but we have it on very hard terms, if we are to dine at the park whenever any one is staying either with them, or with us."
```

### Sense and Sensibility: Chapter XXII

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-22` (ordinal 22)
- **Expected paragraphs:** 55
- **Parsed paragraphs:** 55
- **Expected sentences:** 124
- **Parsed sentences:** 122
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
"You will think my question an odd one, I dare say," said Lucy to her one day, as they were walking together from the park to the cottage--"but pray, are you personally acquainted with your sister-in-law's mother, Mrs. Ferrars?"
```

```text
"No," replied Lucy, "not to Mr. _Robert_ Ferrars--I never saw him in my life; but," fixing her eyes upon Elinor, "to his eldest brother."
```

```text
"Did not you think him sadly out of spirits?" repeated Lucy.
```

### Sense and Sensibility: Chapter XXV

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-25` (ordinal 25)
- **Expected paragraphs:** 22
- **Parsed paragraphs:** 22
- **Expected sentences:** 63
- **Parsed sentences:** 62
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Though Mrs. Jennings was in the habit of spending a large portion of the year at the houses of her children and friends, she was not without a settled habitation of her own. Since the death of her husband, who had traded with success in a …
```

```text
"My objection is this; though I think very well of Mrs. Jennings's heart, she is not a woman whose society can afford us pleasure, or whose protection will give us consequence."
```

```text
After very little farther discourse, it was finally settled that the invitation should be fully accepted. Mrs. Jennings received the information with a great deal of joy, and many assurances of kindness and care; nor was it a matter of ple…
```

### Sense and Sensibility: Chapter XXX

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-30` (ordinal 30)
- **Expected paragraphs:** 43
- **Parsed paragraphs:** 43
- **Expected sentences:** 154
- **Parsed sentences:** 155
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Mrs. Jennings came immediately to their room on her return, and without waiting to have her request of admittance answered, opened the door and walked in with a look of real concern.
```

```text
"Law, my dear! Don't pretend to defend him. No positive engagement indeed! after taking her all over Allenham House, and fixing on the very rooms they were to live in hereafter!"
```

```text
He made no answer; and soon afterwards, by the removal of the tea-things, and the arrangement of the card parties, the subject was necessarily dropped. Mrs. Jennings, who had watched them with pleasure while they were talking, and who expe…
```

### Sense and Sensibility: Chapter XXXII

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-32` (ordinal 32)
- **Expected paragraphs:** 42
- **Parsed paragraphs:** 42
- **Expected sentences:** 86
- **Parsed sentences:** 85
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
To give the feelings or the language of Mrs. Dashwood on receiving and answering Elinor's letter would be only to give a repetition of what her daughters had already felt and said; of a disappointment hardly less painful than Marianne's, a…
```

```text
"Well, my dear," said Mrs. Jennings, "and how did you travel?"
```

```text
"Oh, dear, that is a great pity! but such old friends as Lucy and me!--I think she might see _us_; and I am sure we would not speak a word."
```

### Sense and Sensibility: Chapter XXXIII

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-33` (ordinal 33)
- **Expected paragraphs:** 53
- **Parsed paragraphs:** 53
- **Expected sentences:** 139
- **Parsed sentences:** 138
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
After some opposition, Marianne yielded to her sister's entreaties, and consented to go out with her and Mrs. Jennings one morning for half an hour. She expressly conditioned, however, for paying no visits, and would do no more than accomp…
```

```text
"Me, brother! what do you mean?"
```

```text
"I shall have a charming account to carry to Fanny," said he, as he walked back with his sister. "Lady Middleton is really a most elegant woman! Such a woman as I am sure Fanny will be glad to know. And Mrs. Jennings too, an exceedingly we…
```

### Sense and Sensibility: Chapter XXXVII

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-37` (ordinal 37)
- **Expected paragraphs:** 59
- **Parsed paragraphs:** 59
- **Expected sentences:** 196
- **Parsed sentences:** 194
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Mrs. Palmer was so well at the end of a fortnight, that her mother felt it no longer necessary to give up the whole of her time to her; and, contenting herself with visiting her once or twice a day, returned from that period to her own hom…
```

```text
"Four months! and yet you loved him!"
```

```text
Marianne's indignation burst forth as soon as he quitted the room; and as her vehemence made reserve impossible in Elinor, and unnecessary in Mrs. Jennings, they all joined in a very spirited critique upon the party.
```

### Sense and Sensibility: Chapter XL

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-40` (ordinal 40)
- **Expected paragraphs:** 58
- **Parsed paragraphs:** 58
- **Expected sentences:** 116
- **Parsed sentences:** 118
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
"Well, Miss Dashwood," said Mrs. Jennings, sagaciously smiling, as soon as the gentleman had withdrawn, "I do not ask you what the Colonel has been saying to you; for though, upon my honour, I _tried_ to keep out of hearing, I could not he…
```

```text
"Colonel Brandon is so delicate a man, that he rather wished any one to announce his intentions to Mr. Ferrars than himself."
```

```text
"Aye, aye, the parsonage is but a small one," said she, after the first ebullition of surprise and satisfaction was over, "and very likely _may_ be out of repair; but to hear a man apologising, as I thought, for a house that to my knowledg…
```

### Sense and Sensibility: Chapter XLI

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-41` (ordinal 41)
- **Expected paragraphs:** 38
- **Parsed paragraphs:** 38
- **Expected sentences:** 107
- **Parsed sentences:** 104
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Edward, having carried his thanks to Colonel Brandon, proceeded with his happiness to Lucy; and such was the excess of it by the time he reached Bartlett's Buildings, that she was able to assure Mrs. Jennings, who called on her again the n…
```

```text
"Ah! Elinor," said John, "your reasoning is very good, but it is founded on ignorance of human nature. When Edward's unhappy match takes place, depend upon it his mother will feel as much as if she had never discarded him; and, therefore e…
```

```text
He had just settled this point with great composure, when the entrance of Mrs. John Dashwood put an end to the subject. But though _she_ never spoke of it out of her own family, Elinor could see its influence on her mind, in the something …
```

### Sense and Sensibility: Chapter XLIV

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-44` (ordinal 44)
- **Expected paragraphs:** 84
- **Parsed paragraphs:** 84
- **Expected sentences:** 279
- **Parsed sentences:** 276
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
"No, sir," she replied with firmness, "I shall _not_ stay. Your business cannot be with _me._ The servants, I suppose, forgot to tell you that Mr. Palmer was not in the house."
```

```text
"She taxed me with the offence at once, and my confusion may be guessed. The purity of her life, the formality of her notions, her ignorance of the world,--every thing was against me. The matter itself I could not deny, and vain was every …
```

```text
"Last night, in Drury Lane lobby, I ran against Sir John Middleton, and when he saw who I was, for the first time these two months--he spoke to me. That he had cut me ever since my marriage, I had seen without surprise or resentment. Now, …
```

### Sense and Sensibility: Chapter XLV

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-45` (ordinal 45)
- **Expected paragraphs:** 27
- **Parsed paragraphs:** 27
- **Expected sentences:** 75
- **Parsed sentences:** 74
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Mrs. Dashwood, whose terror as they drew near the house had produced almost the conviction of Marianne's being no more, had no voice to inquire after her, no voice even for Elinor; but _she_, waiting neither for salutation nor inquiry, ins…
```

```text
"His regard for her, infinitely surpassing anything that Willoughby ever felt or feigned, as much more warm, as more sincere or constant, which ever we are to call it, has subsisted through all the knowledge of dear Marianne's unhappy prep…
```

```text
"At Delaford, she will be within an easy distance of me," added Mrs. Dashwood, "even if I remain at Barton; and in all probability,--for I hear it is a large village,--indeed there certainly _must_ be some small house or cottage close by, …
```

### Sense and Sensibility: Chapter XLVI

- **Book:** `sense-and-sensibility`
- **Chapter:** `chapter-46` (ordinal 46)
- **Expected paragraphs:** 34
- **Parsed paragraphs:** 34
- **Expected sentences:** 113
- **Parsed sentences:** 111
- **Result:** SENTENCE COUNT MISMATCH

Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:

```text
Marianne's illness, though weakening in its kind, had not been long enough to make her recovery slow; and with youth, natural strength, and her mother's presence in aid, it proceeded so smoothly as to enable her to remove, within four days…
```

```text
The day of separation and departure arrived; and Marianne, after taking so particular and lengthened a leave of Mrs. Jennings, one so earnestly grateful, so full of respect and kind wishes as seemed due to her own heart from a secret ackno…
```

```text
"They have borne more than our conduct. Do not, my dearest Elinor, let your kindness defend what I know your judgment must censure. My illness has made me think. It has given me leisure and calmness for serious recollection. Long before I …
```

## Database and FTS validation

Not run because source parsing or reference-count validation failed.

## Warnings

None.
