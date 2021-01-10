/**
 * 金額用input フォーカスが外れている間は3桁区切りで表示する
 */
Vue.component("currency-input", {
    template:
        `
		  <input
			ref="input"
			v-model="displayValue"
			v-on:input="updateValue($event.target.value)"
			v-on:blur="formatValueForView"
			v-on:focus="formatValueForEdit"
		  >
	  	`,
    props: {
        value: {
            type: Number,
            default: 0
        },
    },

    data: function () {
        return {
            displayValue: this.value ? this.value : 0,
            hasFocus: false,
        };
    },

    mounted: function () {
        this.formatValueForView();
    },
    methods: {

        //文字列を数値に変換、変換できなければ0を返却
        parseValue: function (value) {
            value = parseInt(value);

            if (Number.isNaN(value)) {
                value = 0;
            }

            return value;
        },

        //数値に直してv-modelを更新
        updateValue: function (value) {
            value = this.parseValue(value);

            this.displayValue = value;
            this.$emit("input", value);
        },

        //inputタグのvalueだけ3桁区切りに直す
        formatValueForView: function () {
            this.displayValue = this.displayValue.toLocaleString();
            this.hasFocus = false;
        },

        //編集用にカンマを取り除く
        formatValueForEdit: function () {
            //readonlyのときはなにもしない
            if (this.$refs.input.readOnly) {
                return;
            }

            this.displayValue = this.parseValue(this.displayValue.replace(/,/g, ''));
            this.hasFocus = true;
        },
    },
    watch: {
        value: function (_new) {
            //フォーカスがない状態で変更があった場合に3桁区切りにしてdisplayValueを更新
            if (this.hasFocus == false) {
                this.displayValue = _new.toLocaleString();
            }
        },
    },
});