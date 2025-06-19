revamp the `/deployment` page with the following changes

1. remove all the existing components
2. add a radio button on the top with options `active`, `inactive`
3. add a radio button with the options `Waiting`, `Entered`
4. show the deployments in a table just like backtest results table
5. make api calls with the respective filters for each of the sections
6. show a button `View Logs` for each deployment
7. show `Pause` and `Resume` icons for each deployment
8. When `View Logs` button is clicked, open a modal


Add `Start All`, `Pause All`, `Exit All` buttons on the top right corner.
Add confirmation modal for each action.

update the lifetime of deployment now()-created_at()
center status and position status above the table

                                        Positions page

Strategy name      Position description     Qty        Entry Avg        P&L       Actions
