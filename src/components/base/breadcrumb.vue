<template>
	<v-breadcrumbs large>
		<template v-for="(item, index) in items">
			<v-breadcrumbs-item
				:disabled="item.disabled"
				:to="item.to"
				exact
			>
				{{ item.text }}
			</v-breadcrumbs-item><!-- Divider except for the last item -->
			<v-breadcrumbs-divider v-if="index < items.length - 1">
				{{ divider }}
			</v-breadcrumbs-divider>
		</template>
	</v-breadcrumbs>
</template>

<script>

export default {
	name: 'breadcrumb',
	props: {
		items: {
			type: Array,
            required: true,
        },
		divider: {
			type: String,
			required: false,
			default: '/'
		}
	},
};
</script>