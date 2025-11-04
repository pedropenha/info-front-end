<template>

    <div class="field">
        <label :for="this.id" class="label">{{ this.label }}</label>
        <div class="control">
            <input 
                :type="this.type" 
                :placeholder="this.placeholder" 
                :id="this.id"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
                class="input"
            />
        </div>
    </div>

</template>

<script>

export default {
    name: "InputField",
    props:{
        placeholder:{
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue']
};

</script>