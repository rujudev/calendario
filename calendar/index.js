const container = document.querySelector('.container')
const header = document.getElementsByTagName('header')[0];
const calendarType = document.querySelectorAll('.tab.tab__item')
const btnMenu = document.querySelector('.btn-menu')
const locale = 'es'

const yearMonths = [...Array(12).keys()]
const daysOfWeek = [...Array(7).keys()]
const actualYear = new Date().getFullYear()
const actualMonth = new Date().getMonth()

const monthFormat = new Intl.DateTimeFormat(locale, { month: 'long' })
const weekDayFormatShort = new Intl.DateTimeFormat(locale, { weekday: 'short' })

const hourFormat = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute:"2-digit" })

const setCalendarType = (calendarType) => {
    let calendar = `<div class="calendar calendar__${calendarType}">`
    const currentMonthName = getMonthName(actualMonth)

    switch (calendarType) {
        case "year":
            calendar += monthNames.map((monthName, index) => calendarStructure(monthName, 'month', index)).join('')

            break;
        case 'month':
            calendar += calendarStructure(currentMonthName, 'month', actualMonth)

            break;
        case 'week':
            calendar += calendarStructure(currentMonthName, 'week')

            break;
        case 'day':
            calendar += calendarStructure(currentMonthName, 'day')
            
            break;
        default:
            break;
    }

    calendar += "</div>"

    return calendar
}

const getMonthName = (monthIndex) => {
    const month = new Date(actualYear, monthIndex)

    return monthFormat.format(month);
}

const getMonthDays = (monthIndex) => {
    if (monthIndex < 0 || monthIndex > 11) return 'Incorrect month index'
    
    const monthStartDate = new Date(actualYear, monthIndex)
    const monthStartWeekDay = monthStartDate.getUTCDay() + 1
    const monthDays = new Date(actualYear, monthIndex + 1, 0).getUTCDate() + 1

    const restPreviousMonthDays = new Date(actualYear, monthIndex, 0).getUTCDate() + 1
    const restNextMonthDaysInCurrentMonth = 43 - (monthDays + monthStartWeekDay)

    let days = '';

    const getDays = (days, isPreviousMonth = false, isCorrectMonth = false, isCurrentMonthDate = false) => {
        return [...Array(days).keys()].map((_day) => {
            let day = isPreviousMonth
                        ? _day + restPreviousMonthDays - (monthStartWeekDay - 1) + 1
                        : _day + 1

            console.log(day)

            const today = new Date().getDate();
            const isToday = isCurrentMonthDate && today === _day + 1
            
            return `
                <div class="month-day" data-correct_month="${isCorrectMonth}" data-today="${isToday}">
                    <input value="${day}" readonly />
                </div>
            `
        }).join('') 
    }

    // Previous Month Last Days
    days += getDays(monthStartWeekDay - 1, true);

    // Current Month Days
    const isCurrentMonthDate = new Date().getMonth() === monthIndex
    days += getDays(monthDays, false, true, isCurrentMonthDate);

    // Next Month Beggining Days
    days += getDays(restNextMonthDaysInCurrentMonth);

    return days
}

const getCurrentWeekDays = () => {
    const currentDate = new Date()
    const currentDateMonth = currentDate.getDate()
    const currentDateDay = currentDate.getDay()

    const firstWeekDay = new Date(currentDate.setDate(currentDateMonth - currentDateDay + (currentDateDay === 0 ? -6 : 1)))

    return daysOfWeek.map(day => day + firstWeekDay.getDate())
}

const getCurrentWeekDayName = () => {
    const date = new Date(actualYear, actualMonth, 1)

    return weekDayFormatShort.format(date).toUpperCase();
}

const getToday = () => {
    const today = new Date().getDate()
    return `
        <div>
            <span data-today="true">${today}</span>
        </div>`
}

const getHoursSelect = (type) => {
    if (type !== 'week' && type !== 'day') return 'Type not available to show hours'
    
    return [...Array(24).keys()].map((_hour) => {
        const hour = hourFormat.format(new Date(actualYear, actualMonth, 1, _hour + 1))
        
        let hourStructure = `
            <div class="day-hour-container">
                <div class="hour-container">
                    <div class="hour">
                        <span style="text-align: center;">${hour}</span>
                    </div>
                </div>
        `
        
        if ( type === 'week') {
            const hoursSelect = daysOfWeek.map(() => hourSelectHTMLStructure).join('');

            hourStructure += hoursSelect
        } else {
            hourStructure += hourSelectHTMLStructure
        }

        hourStructure += '</div>'

        return hourStructure
    }).join('')
}

const monthNames = yearMonths.map((monthIndex) => getMonthName(monthIndex))

const hourSelectHTMLStructure = `
    <div class="hour-day">
        <select class="select-hour-day" multiple></select>
    </div>
`

const weekDaysNameHTMLStructure = daysOfWeek.map((weekDay) => {
    const date = new Date(actualYear, actualMonth, weekDay + 2)
    const dayName = weekDayFormatShort.format(date).toUpperCase()
    
    return `
        <div>
            <span>${dayName}</span>
        </div>
    `
}).join('')

const currentWeekDaysDayHTMLStructure = getCurrentWeekDays().map((weekDay) => {
    const today = new Date().getDate();
    const isToday = weekDay === today;

    return `
        <div>
            <span data-today="${isToday}">${weekDay}</span>
        </div>`
}).join('')


const calendarStructure = (monthName, calendarType, monthIndex = -1) => {
    if (calendarType === 'month' && monthIndex === -1) return 'Incorrect month index'
    if (calendarType !== 'month' && calendarType !== 'week' && calendarType !== 'day') return 'Calendar type not allowed'

    let calendar = `
        <div class="${calendarType}">
            <div class="header">
                <h1 style="text-align: center;">${monthName}</h1>
            </div>
            <div class="week-days-container">
    `

    if (calendarType === 'month') {
        calendar += `
                <div class="week-day-name">
                    ${weekDaysNameHTMLStructure}
                </div>
            </div>
            <div class="month-days-container">
                ${getMonthDays(monthIndex)}
            </div>
        `
    } else if (calendarType === 'week' || calendarType === 'day') {
        const dayOrDaysName = calendarType === 'week' ? weekDaysNameHTMLStructure : getCurrentWeekDayName()
        const dayOrDaysNumber = calendarType === 'week' ? currentWeekDaysDayHTMLStructure : getToday()

        calendar += `
                <div class="week-day-name">${dayOrDaysName}</div>
                <div class="week-day">${dayOrDaysNumber}</div>
            </div>
            <div class="hours-container">
                ${getHoursSelect(calendarType)}
            </div>
        `
    }

    calendar += `</div>`

    return calendar
}

globalThis.addEventListener('load', () => {
    container.innerHTML += setCalendarType('month')
})

calendarType.forEach((element) => {
    element.addEventListener('click', function(e) {
        const { calendar_type: calendarType } = e.target.dataset

        container.innerHTML = setCalendarType(calendarType)
    })
})