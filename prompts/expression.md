create an expression builder to create expressions like 

SMA(CLOSE, 20) > SMA(CLOSE, 50)
MARKET_POSITION == 0 AND CROSS_ABOVE(MACD(12, 26, 9), 0)
RSI(14) < 30 AND VOLUME > SMA(VOLUME, 20)

but using mui react components like dropdown etc.

based off of the grammar that is defined in the expression.md file, the components have to be shown to the user to create exhaustive expessions using this grammar,

i'll give you an example of how you can do this

first show a dropdown that gives the ability to select whatever component that the user want, based off of the below grammar, based on the user's input, show the next possible option that the user can select

/* Trading Expression Builder Grammar */

/* Main expression */
expression ::= condition | logical_expression | arithmetic_expression

/* Logical operations */
logical_expression ::= condition logical_operator condition
                     | condition logical_operator logical_expression
                     | '(' logical_expression ')'

logical_operator ::= 'AND' | 'OR'

/* Conditions */
condition ::= comparison | function_call | boolean_literal | '(' condition ')'

comparison ::= arithmetic_expression comparison_operator arithmetic_expression

comparison_operator ::= '>' | '<' | '>=' | '<=' | '==' | '!='

/* Arithmetic expressions */
arithmetic_expression ::= term
                       | arithmetic_expression '+' term
                       | arithmetic_expression '-' term

term ::= factor
       | term '*' factor
       | term '/' factor
       | term '%' factor

factor ::= primary
         | '-' factor
         | '+' factor

primary ::= number
         | variable_reference
         | function_call
         | '(' arithmetic_expression ')'

/* Variables and functions */
variable_reference ::= market_data | indicator | property

market_data ::= 'PRICE' | 'OPEN' | 'HIGH' | 'LOW' | 'CLOSE' | 'VOLUME'

indicator ::= indicator_name '(' parameter_list ')'

indicator_name ::= 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'BB_UPPER' | 'BB_LOWER' | 'BB_MIDDLE' | 'ATR' | 'STOCH'

property ::= 'PORTFOLIO_VALUE' | 'CASH' | 'POSITION_SIZE' | 'MARKET_POSITION' | 'AVG_ENTRY_PRICE'

function_call ::= function_name '(' parameter_list ')'

function_name ::= 'CROSS_ABOVE' | 'CROSS_BELOW' | 'MAX' | 'MIN' | 'ABS' | 'PERCENT_CHANGE' | 'HIGHEST' | 'LOWEST'

parameter_list ::= /* empty */
                 | expression
                 | expression ',' parameter_list

/* Literals */
number ::= integer | decimal

integer ::= digit+

decimal ::= integer '.' integer

digit ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

boolean_literal ::= 'TRUE' | 'FALSE'

/* Time period and lookback periods */
time_period ::= integer time_unit

time_unit ::= 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH'

/* Example valid expressions:
   - SMA(CLOSE, 20) > SMA(CLOSE, 50)
   - CROSS_ABOVE(CLOSE, SMA(CLOSE, 20))
   - RSI(14) < 30 AND VOLUME > SMA(VOLUME, 20)
   - (CLOSE - OPEN) / OPEN * 100 > 2
   - MARKET_POSITION == 0 AND CROSS_ABOVE(MACD(12, 26, 9), 0)
*/

build one component, use it in both the places