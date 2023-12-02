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
	$selectedPostType = isset($attributes['selectedPostType']) ? $attributes['selectedPostType'] : 'blog';
	$isShowDate = isset($attributes['isShowDate']) ? $attributes['isShowDate'] : true;
	$isShowModified = isset($attributes['isShowModified']) ? $attributes['isShowModified'] : false;
	$isShowContent = isset($attributes['isShowContent']) ? $attributes['isShowContent'] : true;
	$letterCounts = isset($attributes['letterCounts']) ? $attributes['letterCounts'] : 50;
	$postDesign = isset($attributes['postDesign']) ? $attributes['postDesign']: 'post-design1';

	if (!post_type_exists($selectedPostType)) {
			return '<div class="custom-message"><p>表示できるカテゴリーがありません。</p></div>';
	}

	$args = array(
			'post_type' => $selectedPostType,
			'posts_per_page' => $numberOfPosts,
	);
	$query = new WP_Query($args);

	if (!$query->have_posts()) {
			return '<div class="custom-message"><p>投稿がありません。</p></div>';
	}

	$output = '<div class="wp-block-create-block-pf-posts ' . $postDesign . '">';
		while ($query->have_posts()) {
			$query->the_post();
			$output .= '<div class="post-container">';
			$output .= '<h3 class="post-title">';
			$output .= '<a href="' . get_permalink() . '">' . get_the_title() . '</a></h3>';
		
			if ($isShowDate) {
				$output .= '<p class="post-day">投稿日：' . get_the_date('Y年n月j日') . '</p>';
			}

			if ($isShowModified) {
				$output .= '<p class="modified-day">更新日：' . get_the_modified_date('Y年n月j日') . '</p>';
			}

			if ($isShowContent) {
				$content = get_the_content();
				$content = strip_tags($content);
				$content = trim($content);
				$content = (mb_strlen($content) > $letterCounts) ? mb_substr($content, 0, $letterCounts) . '...' : $content;
				$output .= '<p class="post-content">' . $content . '</p>';
			}

			$output .= '</div>';
		}

	$output .= '</div>';

	wp_reset_postdata();

	return $output;
}

function pf_posts_pf_posts_block_init() {
	register_block_type(__DIR__ . '/build', array(
			'render_callback' => 'my_dynamic_block_render_callback',
	));
}

add_action('init', 'pf_posts_pf_posts_block_init');

