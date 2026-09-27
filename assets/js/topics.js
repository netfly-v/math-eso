window.ESO = {
  current: "pitagoras",
  blocks: [
    { id: "fundamento", title: "Фундамент", es: "La base", blurb: "Это из начальной школы. На этом держится всё остальное." },
    { id: "numeros", title: "Числа", es: "Números", val: "Nombres", blurb: "Как считают в 1º ESO и повторяют в начале 2º." },
    { id: "medida", title: "Измерения", es: "Medida", val: "Mesura", blurb: "Метры, граммы, литры и как переводить единицы." },
    { id: "algebra", title: "Алгебра", es: "Álgebra", val: "Àlgebra", blurb: "Буквы вместо чисел и уравнения." },
    { id: "geometria", title: "Геометрия", es: "Geometría", val: "Geometria", blurb: "Углы, фигуры, Пифагор, подобие и объёмы." },
    { id: "datos", title: "Графики и данные", es: "Funciones y estadística", val: "Funcions i estadística", blurb: "Координаты, среднее и вероятность." }
  ],
  topics: [
    { slug: "multiplicacion", block: "fundamento", course: "Primaria", lessons: 7, title: "Умножение", es: "Multiplicación", val: "Multiplicació", blurb: "Таблица и умножение в столбик. Знак в школе — точка ·" },
    { slug: "division", block: "fundamento", course: "Primaria", lessons: 7, title: "Деление", es: "División", val: "Divisió", blurb: "Деление как раздача и столбик так, как пишут в Испании." },
    { slug: "naturales", block: "numeros", course: "ESO 1", lessons: 7, title: "Натуральные числа", es: "Números naturales", val: "Nombres naturals", blurb: "Порядок действий: скобки, потом · и :, потом + и −." },
    { slug: "potencias", block: "numeros", course: "ESO 1–2", lessons: 7, title: "Степени и корни", es: "Potencias y raíces", val: "Potències i arrels", blurb: "Квадрат числа и квадратный корень. Нужны для Пифагора." },
    { slug: "divisibilidad", block: "numeros", course: "ESO 1", lessons: 7, title: "Делимость", es: "Divisibilidad", val: "Divisibilitat", blurb: "Делители, простые числа, НОД и НОК: m.c.d. и m.c.m." },
    { slug: "enteros", block: "numeros", course: "ESO 1–2", lessons: 7, title: "Целые числа", es: "Números enteros", val: "Nombres enters", blurb: "Отрицательные числа, минус на минус и числовая прямая." },
    { slug: "fracciones", block: "numeros", course: "ESO 1–2", lessons: 9, title: "Дроби", es: "Fracciones", val: "Fraccions", blurb: "Доли, сокращение, сложение и умножение дробей." },
    { slug: "decimales", block: "numeros", course: "ESO 1–2", lessons: 7, title: "Десятичные дроби", es: "Números decimales", val: "Nombres decimals", blurb: "Запятая вместо точки и как не перепутать 1.500 и 1,5." },
    { slug: "proporcionalidad", block: "numeros", course: "ESO 1–2", lessons: 7, title: "Пропорции и проценты", es: "Proporcionalidad y porcentajes", val: "Proporcionalitat i percentatges", blurb: "Правило трёх (regla de tres) и скидки в процентах." },
    { slug: "medida", block: "medida", course: "ESO 1", lessons: 6, title: "Единицы измерения", es: "Sistema métrico", val: "Sistema mètric", blurb: "Как переводить см в м и почему у площади шаг другой." },
    { slug: "algebra", block: "algebra", course: "ESO 1–2", lessons: 7, title: "Язык алгебры", es: "Lenguaje algebraico", val: "Llenguatge algebraic", blurb: "Буквы, одночлены и многочлены: monomios и polinomios." },
    { slug: "ecuaciones", block: "algebra", course: "ESO 1–2", lessons: 8, title: "Уравнения", es: "Ecuaciones", val: "Equacions", blurb: "Весы, неизвестное x и первое знакомство с x²." },
    { slug: "angulos", block: "geometria", course: "ESO 1", lessons: 7, title: "Прямые и углы", es: "Rectas y ángulos", val: "Rectes i angles", blurb: "Прямой, острый, тупой и сумма углов треугольника." },
    { slug: "triangulos", block: "geometria", course: "ESO 1", lessons: 7, title: "Треугольники и фигуры", es: "Triángulos y polígonos", val: "Triangles i polígons", blurb: "Виды треугольников, катеты, гипотенуза и окружность." },
    { slug: "areas", block: "geometria", course: "ESO 1", lessons: 7, title: "Периметры и площади", es: "Perímetros y áreas", val: "Perímetres i àrees", blurb: "Прямоугольник, треугольник, трапеция и круг." },
    { slug: "pitagoras", block: "geometria", course: "ESO 2", lessons: 9, title: "Теорема Пифагора", es: "Teorema de Pitágoras", val: "Teorema de Pitàgores", blurb: "Прямоугольный треугольник: a² + b² = c². Тема этой недели." },
    { slug: "semejanza", block: "geometria", course: "ESO 2", lessons: 7, title: "Подобие и Фалес", es: "Semejanza y Tales", val: "Semblança i Tales", blurb: "Одинаковая форма, разный размер и параллельные прямые." },
    { slug: "volumen", block: "geometria", course: "ESO 2", lessons: 7, title: "Тела и объёмы", es: "Cuerpos y volúmenes", val: "Cossos i volums", blurb: "Куб, призма, цилиндр, пирамида, конус и шар." },
    { slug: "funciones", block: "datos", course: "ESO 1", lessons: 6, title: "Координаты и графики", es: "Coordenadas y gráficas", val: "Coordenades i gràfiques", blurb: "Оси, точки и как читать график из жизни." },
    { slug: "estadistica", block: "datos", course: "ESO 1", lessons: 7, title: "Статистика", es: "Estadística", val: "Estadística", blurb: "Таблицы, среднее, мода, медиана и диаграммы." },
    { slug: "probabilidad", block: "datos", course: "ESO 1–2", lessons: 6, title: "Вероятность", es: "Probabilidad", val: "Probabilitat", blurb: "Кубик, монета и дробь «удачные исходы из всех»." }
  ]
};
