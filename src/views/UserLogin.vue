<template>

    
        <CardBox>
            <InputField placeholder="exemple@mail.com" type="email" label="E-mail" id="email"/>
        </CardBox>

</template>

<script>
import { CardBox } from '@/components/CardBox.vue';
import { InputField } from '@/components/InputField.vue';

export default {
    name: "UserLogin",
    components: [
        CardBox, InputField
    ],
};
</script>