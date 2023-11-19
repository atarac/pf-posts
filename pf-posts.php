<?php
/**
 * Plugin Name:       Pf Posts
 * Description:       Display custom posts.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            PINKFREAK
 * Author URI:        https://pink-freak.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       pf-posts
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function my_dynamic_block_render_callback($attributes) {
	$numberOfPosts = isset($attributes['numberOfPosts']) ? $attributes['numberOfPosts'] : 3;
	$selectedPostType = isset($attributes['selectedPostType']) ? $attributes['selectedPostType'] : 'post';

	$args = array(
			'post_type' => $selectedPostType,
			'posts_per_page' => $numberOfPosts,
	);
	$query = new WP_Query($args);
	
	$output = '<div class="wp-block-create-block-pf-posts">';
	while ($query->have_posts()) {
			$query->the_post();
			$output .= '<h3><a href="' . get_permalink() . '">' . get_the_title() . '</a></h3>';
			$output .= '<p>' . get_the_excerpt() . '</p>';
	}
	$output .= '</div>';

	wp_reset_postdata();

	return $output;
}

function pf_posts_pf_posts_block_init() {
	register_block_type( __DIR__ . '/build', array(
			'render_callback' => 'my_dynamic_block_render_callback',
	));
}

add_action('init', 'pf_posts_pf_posts_block_init');
