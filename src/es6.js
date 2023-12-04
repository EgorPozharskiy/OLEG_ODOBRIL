"use strict";
// в данных задачах нужно использовать возможности es6
// ко всем заданиям можно (а местами и нужно) дописать свои тесты в файле es6.spec.js
// Можно менять параметры функций (например сделать им значения по умолчанию)
// Напишите функцию, которая принимает ФИО пользователя и возвращает
// строку формата Имя Фамилия
function fioToName(fio) {
    let [surname, name] = fio.split(' ');
    return name && surname ? `${name} ${surname}` : '';
}

// преобразуйте массив чисел так, чтобы в нем остались только
// уникальные элементы
// присмотритесь к коллекции "Set"
function filterUnique(array) {
    return Array.from(new Set(array));
}


// Задача: разница зарплат
// в функцию приходит массив из n зарплат сотрудников фирмы
// ваша задача определить, во сколько раз зарплата самого высокооплачиваемого
// сотрудника превышает зарплату самого низкооплачиваемого
function calculateSalaryDifference(salaries) {
    if (salaries.length === 0) return 0;
    let maxSalary = Math.max(...salaries);
    let minSalary = Math.min(...salaries);
    return maxSalary / minSalary;
}


// Реализуйте класс "словарь слов" (как толковый словарь)
// класс должен быть безопасным и работать только со словами
// присмотритесь к коллекции "Map"
// Словарь - (string, string), и все это не null и не undefined
// * покройте класс тестами
class Dictionary {
    constructor() {
        this.map = new Map();
    }

    add(word, definition) {
        if (typeof word === 'string' && typeof definition === 'string') {
            this.map.set(word, definition);
        }
    }

    get(word) {
        if (typeof word === 'string') {
            return this.map.get(word);
        }
    }

    remove(word) {
        if (typeof word === 'string') {
            this.map.delete(word);
        }
    }

    get size() {
        return this.map.size;
    }

    // Методы для тестирования
    has(word) {
        return this.map.has(word);
    }

    getAllWords() {
        return [...this.map.keys()];
    }
}

module.exports = {
    fioToName,
    filterUnique,
    calculateSalaryDifference,
    Dictionary
};
