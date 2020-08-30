<template>
    <div class="container admin">
        <div class="admin-menu">
            <h1>Admin Menu</h1>
            <p>Change the place and schedule</p>
            <router-link to="/admin/schedule" class="btn">Create Schedule</router-link>
        </div>
        <div class="admin-create">
            <div class="item form">
                <h1 role="heading" class="heading">Create Place</h1>
                <div class="panel-content">
                    <form role="form">
                        <div class="form-group">
                            <label for="">Name:</label>
                            <input
                                type="text"
                                placeholder="Name"
                                class="input"
                                v-model="place.name"
                            >
                        </div>
                        <div class="form-group">
                            <label for="">Type:</label>
                            <select class="input" v-model="place.type">
                                <option value="attractions">Attractions</option>
                                <option value="restaurants">Restautrans</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="">Latitude</label>
                            <input
                                type="number"
                                placeholder="Latitude"
                                class="input"
                                v-model="place.latitude"
                            >
                        </div>
                        <div class="form-group">
                            <label for="">Longitude</label>
                            <input
                                type="number"
                                placeholder="Longitude"
                                class="input"
                                v-model="place.longitude"
                            >
                        </div>
                        <div class="form-group">
                            <label for="">Open Time</label>
                            <input
                                type="time"
                                placeholder="Open Time"
                                class="input"
                                v-model="place.open_time"
                            >
                        </div>
                        <div class="form-group">
                            <label for="">Close Time</label>
                            <input
                                type="time"
                                placeholder="Close Time"
                                class="input"
                                v-model="place.close_time"
                            >
                        </div>
                        <div class="form-group">
                            <label for="">Description</label>
                            <textarea
                                rows="10"
                                class="input"
                                v-model="place.description"
                            ></textarea>
                        </div>
                        <div class="form-group">
                            <label for="image" class="input image-upload">Upload Image Here</label>
                            <input
                                type="file"
                                id="image"
                                @change="imageChange($event)"
                            >
                        </div>
                        <div class="form-group form-content-right">
                            <button
                                type="submit"
                                class="btn btn-submit"
                                @click.prevent="createPlace"
                                v-show="!isEdit"
                            >Create Place</button>
                            <button
                                type="submit"
                                class="btn btn-submit"
                                @click.prevent="updatePlace"
                                v-show="isEdit"
                            >Edit Place</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="admin-table">
            <table class="table">
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>X</th>
                    <th>Y</th>
                    <th>Image</th>
                    <th>Description</th>
                    <!-- <th>Open Time</th>
                    <th>Close Time</th> -->
                    <th>Action</th>
                </tr>
                <tr v-for="(place,i) in this.places" :key="place.id">
                    <td>{{ i+1 }}</td>
                    <td>{{ place.name }}</td>
                    <td>{{ place.type }}</td>
                    <td>{{ place.latitude }}</td>
                    <td>{{ place.longitude }}</td>
                    <td>{{ place.x }}</td>
                    <td>{{ place.y }}</td>
                    <td>
                        <img :src="'http://localhost:8000/images/'+place.image_path" alt="">
                    </td>
                    <td>{{ place.description }}</td>
                    <!-- <td>{{ place.open_time }}</td>
                    <td>{{ place.close_time }}</td> -->
                    <td>
                        <button
                            class="btn btn-edit mb-5"
                            @click="editPlace(place.id)"
                        >Edit</button>
                        <button
                            class="btn btn-del"
                            @click="deletePlace(place.id)"
                        >Delete</button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            domain: 'http://localhost:8000/api/v1',
            places: [],
            place: {
                name: '',
                type: '',
                latitude: '',
                longitude: '',
                description: '',
                open_time: '',
                close_time: '',
                image: ''
            },
            isEdit: 0
        }
    },
    created() {
        this.fetchPlace();
    },
    methods: {
        imageChange(e) {
            let labelName = e.target.previousElementSibling;
            labelName.innerHTML = e.target.files[0].name;

            this.place.image = e.target.files[0];
            // console.log(e.target.files[0])
        },
        resetInput() {
            Object.keys(this.place).forEach((key, i) => {
                this.place[key] = ''
            })
            localStorage.removeItem('place_id');
        },
        fetchPlace() {
            axios.get(`${this.domain}/place?token=21232f297a57a5a743894a0e4a801fc3`)
                .then(res => {
                    this.places = res.data
                    // console.log(this.places)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        createPlace() {
            let formData = new FormData();
            for(let key in this.place) {
                formData.append(key, this.place[key]);
            }

            axios.post(`${this.domain}/place?token=21232f297a57a5a743894a0e4a801fc3`, formData)
                .then(res => {
                    console.log(res)
                    this.fetchPlace();
                    alert(res.data.message)
                })
                .catch(err => {
                    console.log(err)
                })
        },
        editPlace(id) {
            localStorage.setItem('place_id', id);

            let placeEdit = this.places.filter(item => item.id == id)
            let p = placeEdit[0];

            this.place.name = p.name;
            this.place.type = p.type;
            this.place.latitude = p.latitude;
            this.place.longitude = p.longitude;
            this.place.open_time = p.open_time;
            this.place.close_time = p.close_time;
            this.place.description = p.description;

            this.isEdit = 1;
        },
        updatePlace() {
            this.isEdit = 0;
            let id = localStorage.getItem('place_id', id);
            let formData = new FormData();
            for(let key in this.place) {
                formData.append(key, this.place[key]);
            }
            formData.append('_method','PUT');

            axios.post(`${this.domain}/place/${id}?token=21232f297a57a5a743894a0e4a801fc3`, formData)
                .then(res => {
                    console.log(res)
                    alert(res.data.message)
                    this.fetchPlace();
                    this.resetInput();
                })
                .catch(err => {
                    console.log(err)
                })
        },
        deletePlace(id) {
            axios.delete(`${this.domain}/place/${id}?token=21232f297a57a5a743894a0e4a801fc3`)
                .then(res => {
                    this.fetchPlace();
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}
</script>