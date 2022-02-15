grammar StarRealms;
battle           : turn+ EOF ;
turn             : action+ endPhase ;
action           : summaryAction NEWLINE actionDetail* ;
endPhase         : endTurn NEWLINE drawPhase ;
summaryAction    : play | purchase | attackPlayer | attackBase | scrap | discard | activateBase ;
actionDetail     : (scrapDetail | newBalanceDetail | newAbility | destroyBase) NEWLINE;
drawPhase        : (drawCards NEWLINE)? (shuffleCards NEWLINE drawCards NEWLINE)? refreshIndicators NEWLINE newTurn NEWLINE;
drawCards        : DREW INT 'cards';
activateBase     : 'Chose' 'Add' INT WORD ;
discard          : resolveDiscard discardAction+ discardDetails ;
resolveDiscard   : 'Resolving' WORD INT 'cards' NEWLINE;
discardAction    : name IS WORD card NEWLINE ;
discardDetails   : 'no' 'more' 'cards' 'to' 'discard' NEWLINE (DISCARDED card NEWLINE)+ ;
play             : (PLAY ALL) | playSingle;
playSingle       : PLAYED card;
purchase         : ACQUIRED card ;
attackPlayer     : ATTACKED name WORD INT newAuthority;
attackBase       : ATTACKED card;
scrap            : (name IS SCRAPPING ':' card) | (SCRAPPING card);
scrapDetail      : SCRAPPED card ;
newBalanceDetail : name SEPARATOR card? effect balance ;
newAbility       : name SEPARATOR card 'ability' 'available';
destroyBase      : 'Destroyed' card ;
effect           : (INCREMENT | DECREASE) WORD ;
balance          : '('WORD':'INT')' ;
newAuthority     : '(' NEW WORD':'INT')' ;
endTurn          : name ENDS TURN INT ;
newTurn          : IT IS NOW name '\'s' TURN INT ;
shuffleCards     : 'Shuffled' 'discard' 'pile' 'to' 'form' 'new' 'deck' ;
refreshIndicators : 'Refresh' 'ally' 'indicators' ;
name             : WORD+ ;
card             : WORD+ ;

fragment A : ('A'|'a');
fragment B : ('B'|'b');
fragment C : ('C'|'c');
fragment D : ('D'|'d');
fragment E : ('E'|'e');
fragment F : ('F'|'f');
fragment G : ('G'|'g');
fragment H : ('H'|'h');
fragment I : ('I'|'i');
fragment J : ('J'|'j');
fragment K : ('K'|'k');
fragment L : ('L'|'l');
fragment M : ('M'|'m');
fragment N : ('N'|'n');
fragment O : ('O'|'o');
fragment P : ('P'|'p');
fragment Q : ('Q'|'q');
fragment R : ('R'|'r');
fragment S : ('S'|'s');
fragment T : ('T'|'t');
fragment U : ('U'|'u');
fragment V : ('V'|'v');
fragment W : ('W'|'w');
fragment Y : ('Y'|'y');


ACQUIRED            : A C Q U I R E D ;
ATTACKED            : A T T A C K E D ;
SCRAPPING           : S C R A P P I N G ;
SCRAPPED            : S C R A P P E D ;
SHUFFLED            : S H U F F L E D ;
DISCARDED           : D I S C A R D E D ;
RESOLVING           : R E S O L V I N G ;
TURN                : T U R N ;
PILE                : P I L E ;
PLAY                : P L A Y ;
FORM                : F O R M ;
DECK                : D E C K ;
DREW                : D R E W ;
ENDS                : E N D S ;
NEW                 : N E W ;
ALL                 : A L L ;
NOW                 : N O W ;
IS                  : I S ;
IT                  : I T ;

WHITESPACE          : (' ' | '\t') -> skip ;
COLOR_START_TAG     : '<color=#'(LETTER | INT)*'>' -> skip ;
COLOR_END_TAG       : '</color>' -> skip ;
DOT                 : '.' -> skip ;
APOSTROPHE          : '\'' -> skip ;
PLAYED              : 'Played' ;
INT                 : [0-9]+ ;
fragment LETTER     : [A-Za-z] ;
WORD                : LETTER+ ;
SEPARATOR           : '>' | '-' | '<';
INCREMENT           : '+'INT ;
DECREASE            : '-'INT ;
NEWLINE             : ('\r'? '\n' | '\r')+ ;