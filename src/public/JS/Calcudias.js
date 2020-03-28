class Calendar {
    constructor(id) {
        this.cells1 = [];
        this.selDay = null;
        this.mesActual = moment();
        this.elCalendar = document.getElementById(id);
        this.mostrarPlantilla();
        this.elGridBody = this.elCalendar.querySelector('.grid__body');
        this.elNombredelMes = this.elCalendar.querySelector('.month-name')
        this.muestraDias();
    }

    mostrarPlantilla() {
        this.elCalendar.innerHTML = this.obtenerCeldas();
        this.addEventListenerToControls();
    }

    addEventListenerToControls() {
        let elControls = this.elCalendar.querySelectorAll('.control');
        elControls.forEach(elControl => {
            elControl.addEventListener('click', e => {
                let elTa = e.target;
                let next = false;
                if (elTa.classList.contains('control--next')) {
                    next = true;
                }
                this.changeMonths(next);
                this.muestraDias();
            })
        })
    }

    changeMonths(next = true) {
        if (next) {
            this.mesActual.add(1, 'months')
        } else {
            this.mesActual.subtract(1, 'months')
        }
    }

    obtenerCeldas() {
        let celdas = `
        <div class="calendar__header">
                    <button type="button" class="control control--prev">&lt;</button>
                    <samp class="month-name">Febrero 2020</samp>
                    <button type="button" class="control control--next">&gt;</button>
                </div>
                <div class="calendar_body">
                    <div class="grid">
                        <div class="grid__header">
                            <span class="grid__cell grid__cell--gh">Lun</span>
                            <span class="grid__cell grid__cell--gh">Mar</span>
                            <span class="grid__cell grid__cell--gh">Mie</span>
                            <span class="grid__cell grid__cell--gh">Jue</span>
                            <span class="grid__cell grid__cell--gh">Vie</span>
                            <span class="grid__cell grid__cell--gh">Sab</span>
                            <span class="grid__cell grid__cell--gh">Dom</span>
                        </div>
                        <div class="grid__body">
                            
                        </div>
                    </div>
                </div>
    `;
        return celdas;
    }

    muestraDias() {
        this.cells1 = this.generaFechas(this.mesActual);
        if (this.cells1 == null) {
            console.error('No se pueden generar las fechas');
            return;
        }
        this.elGridBody.innerHTML = '';
        let tmplateCell = '';
        let disableClass = '';
        for (let i = 0; i < this.cells1.length; i++) {
            disableClass = "";
            if (!this.cells1[i].isInCurrentMonth) {
                disableClass = "grid__cell--disabled";
            }
            tmplateCell += `
            <span class="grid__cell grid__cell--gd ${disableClass}"  data-cell-id='${i}'>
                ${this.cells1[i].date.date()}
            </span>
            `;
            //<span class="grid__cell grid__cell--gd grid__cell--disabled" ></span>
        }
        this.elNombredelMes.innerHTML = this.mesActual.format('MMM YYYY');
        this.elGridBody.innerHTML = tmplateCell;
        this.addEventListenerToCells();
    }

    addEventListenerToCells() {
        let elCells = this.elCalendar.querySelectorAll('.grid__cell--gd');
        elCells.forEach(elCell => {
            elCell.addEventListener('click', e => {
                let elTg = e.target;
                let sectCell = this.elGridBody.querySelector('.grid__cell--selected')
                if (elTg.classList.contains('grid__cell--disabled') || elTg.classList.contains('grid__cell--selected')) {
                    console.error("No pertenece al mes")
                    return
                }
                if (sectCell) {
                    sectCell.classList.remove("grid__cell--selected")
                }
                elTg.classList.add("grid__cell--selected")
                this.selDay = this.cells1[parseInt(elTg.dataset.cellId)].date;
                this.elCalendar.dispatchEvent(new Event('change'))
            });
        });
    }

    generaFechas(mesMost = moment()) {
        if (!moment.isMoment(mesMost)) {
            return null;
        }
        let prFecha = moment(mesMost).startOf('month');
        let ulFecha = moment(mesMost).endOf('month');
        let cells = [];
        while (prFecha.day() !== 1) {
            prFecha.subtract(1, 'days')
        }
        while (ulFecha.day() !== 0) {
            ulFecha.add(1, 'days')
        }
        do {
            cells.push({
                date: moment(prFecha),
                isInCurrentMonth: prFecha.month() === mesMost.month()
            })
            prFecha.add(1, 'days');
        } while (prFecha <= ulFecha);
        return cells;
    }

    getElement() {
        return this.elCalendar;
    }

    value() {
        return this.selDay;
    }
}