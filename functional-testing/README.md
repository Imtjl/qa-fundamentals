# Functional testing

## Usage

### Java/Kotlin

- Compile custom annotation

```bash
gradle test-annotations:build
```

- Run new cross-browser Java tests implementation:

```bash
gradle java-v2-impl:build --warning-mode all
```

> `output`:
> > Task :java-v2-impl:test
> FastPicTest > Проверка главной страницы > [1] EDGE PASSED
> FastPicTest > Проверка вкладок (кроме Firefox) > [1] CHROME PASSED
> FastPicTest > Проверка вкладок (кроме Firefox) > [2] EDGE PASSED
> FastPicTest > Тест только в Chrome > [1] CHROME PASSED

- Run Kotlin simple cross-browser concept tests implementation:

```bash
gradle kotlin-impl:test
```

- Run legacy Java tests implementation:

```bash
gradle java-v1-impl:test
```

### Typescript

- Go into `ts-impl` repo and install packages

```bash
cd ts-impl
npm i
```

- Run tests

```bash
npm test
```

## Задание

Сформировать варианты использования, разработать на их основе тестовое покрытие
и провести функциональное тестирование интерфейса сайта в соответствии с
вариантом.

---

Вариант: `39765`  
Хостинг картинок, изображений - https://fastpic.org/

---

## Требования к выполнению работы:

1. Тестовое покрытие должно быть сформировано на основании набора прецедентов
   использования сайта.
1. Тестирование должно осуществляться автоматически - с помощью системы
   автоматизированного тестирования [Selenium](http://docs.seleniumhq.org/).
1. Шаблоны тестов должны формироваться при помощи Selenium IDE и исполняться при
   помощи Selenium RC в браузерах Firefox и Chrome.
1. Предполагается, что тестируемый сайт использует динамическую генерацию
   элементов на странице, т.е. выбор элемента в DOM должен осуществляться не на
   основании его ID, а с помощью [XPath](http://ru.wikipedia.org/wiki/XPath).

## Требования к содержанию отчёта

1. Текст задания.
1. UseCase-диаграмму с прецедентами использования тестируемого сайта.
1. CheckList тестового покрытия.
1. Описание набора тестовых сценариев.
1. Результаты тестирования.
1. Выводы.

## Вопросы к защите лабораторной работы

- [ ] Функциональное тестирование. Основные понятия, способы организации и
      решаемые задачи.
- [ ] Система Selenium. Архитектура, принципы написания сценариев, способы
      доступа к элементам страницы.
- [ ] Язык XPath. Основные конструкции, системные функции, работа с множествами
      элементов.
