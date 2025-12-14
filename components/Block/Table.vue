<template>
  <Section :id="data?.anchor_id || null">

    <Container>
      <div class="max-w-[540px] mx-auto text-center mb-4 md:mb-6 lg:mb-8">
        <ElementPretitle
        v-if="data.pretitle"
        :text="data.pretitle" 
        :color="data.color ? data.color : '#D6C5F7'" 
        size="large"
        />
        <h2 v-if="data.title" class="text-2xl md:text-2xl lg:text-3xl font-bold mt-4 mb-2 lg:mb-4">
          {{ data.title }}
        </h2>
        <p v-if="data.subtitle" class="text-base">{{ data.subtitle }}</p>
      </div>
    </Container>

    <div class="overflow-scroll hide-scrollbar md:overflow-visible">
      <div 
      class="min-w-[480px] md:mx-auto mt-4 px-4 md:px-8"
      :class="[
        tableCols === 3 ? 'max-w-5xl' : '',
        tableCols === 2 ? 'max-w-4xl' : '',
        tableCols === 1 ? 'max-w-4xl' : ''
      ]"
      >
        <div class="w-full border-2 border-grey-med-light rounded-lg">
          <div
          v-for="(rowWrapper, rowIndex) in data.table"
          :key="rowWrapper.id"
          class="grid"
          :class="[
            rowWrapper.table_row_id.header_row ? 'font-bold text-center text-lg md:text-xl' : '', 
            rowWrapper.table_row_id.col3_text ? 'grid-cols-3' : 'grid-cols-2'
          ]"
          >
            <div
            v-if="rowWrapper.table_row_id.col1_text"
            :class="[
              rowIndex < data.table.length - 1 ? 'border-b-2 border-grey-med-light' : '',
              rowWrapper.table_row_id.col2_text ? 'border-r-2 border-grey-med-light' : ''
            ]"
            >
              <div class="p-4 flex">
                <div
                v-if="rowWrapper.table_row_id.col1_icon"
                v-html="iconName(rowWrapper.table_row_id.col1_icon)"
                class="pr-4"
                ></div>
                <div class="table-text text-sm md:text-base" v-html="rowWrapper.table_row_id.col1_text"></div>
              </div>
            </div>
            <div
            v-if="rowWrapper.table_row_id.col2_text"
            :class="[
              rowIndex < data.table.length - 1 ? 'border-b-2 border-grey-med-light' : '',
              rowWrapper.table_row_id.col3_text ? 'border-r-2 border-grey-med-light' : ''
            ]"
            >
              <div class="p-4 flex">
                <div
                v-if="rowWrapper.table_row_id.col2_icon"
                v-html="iconName(rowWrapper.table_row_id.col2_icon)"
                class="pr-4"
                ></div>
                <div class="table-text text-sm md:text-base" v-html="rowWrapper.table_row_id.col2_text"></div>
              </div>
            </div>
            <div
            v-if="rowWrapper.table_row_id.col3_text"
            :class="[
              rowIndex < data.table.length - 1 ? 'border-b-2 border-grey-med-light' : ''
            ]"
            >
              <div class="p-4 flex">
                <div
                v-if="rowWrapper.table_row_id.col3_icon"
                v-html="iconName(rowWrapper.table_row_id.col3_icon)"
                class="pr-4"
                ></div>
                <div class="table-text text-sm md:text-base" v-html="rowWrapper.table_row_id.col3_text"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </Section>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const tableCols = computed(() => {
  props.data.table.forEach(rowWrapper => {
    const row = rowWrapper.table_row_id
    if (row.col3_text) {
      return 3
    } else if (row.col2_text) {
      return 2
    } else {
      return 1
    }
  })
  return 1
})

const iconName = icon => {
  switch (icon) {
    case 'correct':
      return `<svg class="w-8 h-8 md:w-10 md:h-10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" viewBox="0 0 810 809.999993" height="1080" version="1.0"><defs><clipPath id="9032ae352b"><path d="M 64 79 L 749.671875 79 L 749.671875 728 L 64 728 Z M 64 79 " clip-rule="nonzero"/></clipPath></defs><rect x="-81" width="972" fill="#ffffff" y="-80.999999" height="971.999992" fill-opacity="1"/><rect x="-81" width="972" fill="#ffffff" y="-80.999999" height="971.999992" fill-opacity="1"/><g clip-path="url(#9032ae352b)"><path fill="#2d943e" d="M 749.691406 79.851562 C 749.691406 79.851562 639.941406 143.976562 505.386719 370.851562 C 459.460938 448.285156 410.660156 544.664062 362.34375 663.921875 C 359.472656 670.980469 354.300781 676.878906 347.660156 680.617188 L 271.933594 723.3125 C 254.886719 732.929688 233.339844 724.183594 227.796875 705.414062 C 208.984375 641.648438 161.652344 510.835938 72.597656 432.566406 C 60.425781 421.871094 62.101562 402.441406 75.859375 393.859375 L 155.433594 344.25 C 175.695312 331.617188 202.300781 336.964844 216.097656 356.449219 L 300.277344 475.277344 C 505.6875 76.839844 749.691406 79.851562 749.691406 79.851562 " fill-opacity="1" fill-rule="nonzero"/></g></svg>`
    case 'incorrect':
      return `<svg class="w-8 h-8 md:w-10 md:h-10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" viewBox="0 0 810 809.999993" height="1080" version="1.0"><rect x="-81" width="972" fill="#ffffff" y="-80.999999" height="971.999992" fill-opacity="1"/><rect x="-81" width="972" fill="#ffffff" y="-80.999999" height="971.999992" fill-opacity="1"/><path fill="#ff4b40" d="M 655.308594 46.257812 C 639.886719 50.253906 611.628906 65.09375 585.652344 82.785156 C 549.398438 107.039062 466.320312 184.085938 404.375 250.574219 L 382.105469 274.542969 L 371.828125 263.128906 C 328.152344 215.1875 304.171875 189.792969 272.484375 158.691406 C 207.109375 94.484375 194.261719 86.78125 154.582031 86.78125 C 122.039062 86.78125 108.621094 94.769531 112.90625 111.890625 C 117.183594 129.015625 213.105469 261.132812 271.339844 330.1875 C 299.890625 364.144531 303.03125 368.996094 299.605469 373.5625 C 297.605469 376.414062 278.195312 401.242188 256.496094 428.636719 C 189.695312 514.242188 133.742188 598.136719 100.058594 664.054688 C 83.5 696.300781 80.359375 708.285156 86.070312 719.128906 C 98.34375 741.667969 173.140625 745.953125 197.691406 725.40625 C 202.542969 721.125 219.386719 698.582031 235.371094 674.898438 C 289.898438 593.285156 381.820312 465.445312 384.390625 468.300781 C 384.675781 468.871094 394.382812 482.570312 406.085938 499.117188 C 444.054688 553.90625 519.417969 652.066406 540.832031 674.898438 C 552.25 687.453125 567.664062 705.429688 575.089844 715.132812 C 593.359375 739.101562 606.773438 749.371094 628.183594 755.941406 C 673.859375 770.207031 721.820312 756.796875 727.246094 728.261719 C 729.816406 715.132812 716.113281 688.878906 691.847656 659.488281 C 681.851562 647.503906 668.152344 629.8125 661.871094 620.394531 C 641.894531 591 611.058594 549.910156 591.359375 526.226562 C 580.800781 513.671875 563.378906 491.128906 552.535156 476.292969 C 541.398438 461.453125 516.851562 430.632812 497.722656 408.089844 L 462.898438 367.285156 L 469.175781 358.152344 C 490.585938 328.191406 566.234375 242.585938 628.757812 178.09375 C 695.273438 109.039062 706.121094 96.199219 718.679688 73.085938 C 721.820312 67.375 722.109375 63.953125 719.820312 59.671875 C 712.6875 46.257812 681.285156 39.695312 655.308594 46.257812 " fill-opacity="1" fill-rule="evenodd"/></svg>`
    default:
      return ''
  }
}
</script>

<style lang="scss">
.table-text {
  strong {
    display: block;
    margin-bottom: 5px;
  }
  ul {
    padding-left: 12px;
    list-style-type: disc;
    margin-bottom: 0;
    padding-bottom: 0!important;
  }
}
</style>