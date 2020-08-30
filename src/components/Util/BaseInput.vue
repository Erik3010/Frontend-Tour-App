<template>
   <div class="form-group route-group">
        <label for="">{{ label }}: </label>
        <input
            type="text"
            name="from"
            :placeholder="placeholder"
            class="input"
            v-model="place"
            @input="onType"
            autocomplete="off"
        >
        <ul class="autocomplete" v-show="isOpen">
            <li
                v-for="res in result"
                :key="res.id"
                @click="setResult(res.name)"
            >
                {{ res.name }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        placeArray: {
            type: Array,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            place: '',
            isOpen: 0,
            result: []
        }
    },
    methods: {
        showPlace() {
            this.result = this.placeArray;
            this.open = 1;
        },
        onType() {
            this.isOpen = 1;
            this.filterData()
            this.$emit('input', this.place)
        },
        filterData() {
            this.result = this.placeArray.filter((p) => {
                return p.name.toLowerCase().indexOf(this.place.toLowerCase()) >= 0
            })

            if(!this.result.length) this.isOpen = 0;
        },
        setResult(name) {
            this.place = name;
            this.$emit('selection', name);
            this.isOpen = 0;
        }
    }
}
</script>

<style>
.route-group {
    position: relative;
}

.autocomplete {
    position: absolute;
    list-style: none;
    width: 100%;
    background: white;
    border: 1px solid #d2d2d2;
    margin: 3px 0 0 0;
    padding: 5px 0;
    top: 65px;
    border-radius: 5px;
    z-index: 10;
}

.autocomplete > li {
    width: 100%;
    cursor: pointer;
    padding: 10px 17px;
}

.autocomplete > li:hover {
    background: #cc0000;
    color: white;
}
</style>