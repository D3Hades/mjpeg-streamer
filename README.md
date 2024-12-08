# Потоковый MJPEG-стример рабочего стола на NodeJS

MJPEG потоковый стример рабочего стола с использованием библиотеки [screenshot-desktop](https://www.npmjs.com/package/screenshot-desktop).

---
## Требования
Программа требует установленную библиотеку [screenshot-desktop](https://www.npmjs.com/package/screenshot-desktop).

```bash
$ npm install --save screenshot-desktop
```

## Использование
Программа получает jpg кадр рабочего стола с помощью библиотеки, разбивает их на пакеты, и через UDP протокол отправляет на указанный адрес и порт

### Структура пакета

<table>
	<tbody>
		<tr>
			<td>Биты</td>
			<td>0 - 15</td>
			<td>16-23</td>
			<td>24-31</td>
		</tr>
		<tr>
			<td>0-31</td>
			<td>Размер полезной нагрузки</td>
			<td colspan="2">Номер кадра</td>
		</tr>
		<tr>
			<td>32-63</td>
			<td>Номер пакета в кадре</td>
			<td>Флаг последнего пакета кадра</td>
			<td>Полезная нагрузка</td>
		</tr>
		<tr>
			<td>64-...</td>
			<td colspan="3">Полезная нагрузка</td>
		</tr>
	</tbody>
</table>