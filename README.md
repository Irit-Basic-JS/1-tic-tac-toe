### Задача дописать игру в крестики-нолики.

Сейчас в коде описаны функции для рисования поля любого размера и рисования любого символа в клетке этого поля.
Твоя задача дописать код, чтобы это стало полноценной игрой в Крестики-нолики.

1. - [x] Реши, как будешь хранить поле. Тебе нужна будет такая структура, в которой удобно понимать есть ли победитель: три клетки по горизонтали, вертикали или диагонали, заполненные одинаковыми символами.
2. - [x] Допиши функцию cellClickHandler, чтобы после клика ставился крестик или нолик в соответствующее поле.
3. - [x] Если поле, по которому кликнули, не пустое, символ ставиться не должен. 
4. - [x] Если кончились ходы, выведи alert с текстом "Победила дружба".
5. - [x] Напиши функцию, которая считает: есть ли уже победитель. Если есть победитель, выведи alert с названием победителя.
6. - [x] Если есть победитель, покрась победные значения в клетках в красный.
7. - [x] После победы, клик по полю больше не должен ставить крестик или нолик.
8. - [x] Обрабатывай клик по кнопке "Сначала": допиши метод resetClickHandler, чтобы поле очищалось.
9. - [x] \* Сделай так, чтобы можно было в начале игры задавать поле произвольного размера.
10. - [x] \* Напиши "искусственный интеллект" — функцию, которая будет ставить нолики в случайное пустое поле.
11. - [ ] \* Напиши чуть более умный искусственный интеллект — функция, ставящая нолики в случайном месте обязана поставить нолик в такое поле, нолик в котором приведет к выигрышу "ИИ".
12. - [ ] \* Сделай так, чтобы при заполнении больше половины клеток на поле, оно бы расширялось: добавлялось бы по одному ряду с каждой стороны.
