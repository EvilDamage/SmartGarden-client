# Inteligentny ogród

Celem pracy jest stworzenie modelu ogrodu z systemem Smart, który będzie opierał się na mikrokomputerze Raspberry Pi. System umożliwi: monitorowanie aktualnych parametrów, deklarowanie przez użytkownika profili roślin z zadanymi wartościami do których system będzie automatycznie dążyć, sprawdzenie historii wcześniejszych odczytów.

## Technologie

- Node v16.13.1
- NPM v8.1.2
- React 17.0.2
- Apollo Client 3.5.6

    
## Uruchomienie

Po skonowaniu rezpoytorium należy zainstalować node_modules

    npm install

### Start

    npm start
    
    
## Podgląd 


## Opis Aplikacji

Głównym zadaniem aplikacji jest umożliwienie użytkownikowi w przystępny wizualnie sposób przeglądania zebranych informacji oraz zarządzenie parametrami, do których będzie dążyć system podczas uprawy roślin. Jednym ze sposobów zarządzania jest tworzenie harmonogramów, które pozwalają zmieniać warunki panujące wewnątrz modelu szklarni w zależności od etapu wzrostu roślin. Istnieje możliwość ustawienia parametrów manualnie i nie będą one ulegać zmianie. Aplikacja łączy się z serwerem Node.js przy wykorzystaniu Apollo Client, który odpowiada za odczyty z czujników, zapisywanie danych w bazie danych MongoDB Atlas oraz za API GraphQl.


Aplikacja umożliwia:
- Rejestracje
- Logowanie oraz resetowanie hasła w przypadku utraty
- Przegląd zebranych danych w formie wykresów
- Wyeksportowanie zebranych danych w formacie pliku .csv
- Manualne ustawienie parametrów docelowych oraz ilość dozowanego nawozu
- Tworzenie harmonogramów dla wzrostu roślin 
- Dostęp do historii wykonanych operacji przez system
- Ustawienia pojedynczych narzędzi (pomp, oświetlenie, wentylacja)
- Edycja profilu użytkownika
- Zarządzanie użytkownikami
- Zapraszanie nowych użytkowników


Aplikacja jest realizowana w ramach pracy inżynierskiej.



**Autor: Przemysław Kuca**
