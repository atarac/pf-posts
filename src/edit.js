import { useSelect } from '@wordpress/data';
import React, { useState, useEffect } from 'react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { RangeControl, SelectControl, Spinner } from '@wordpress/components';

const RenderPosts = ({ posts, postTypes }) => {
	if (!postTypes || !postTypes.length) {
		return (
			<div className="custom-message">
				<p>表示できるカテゴリーがありません。</p>
			</div>
		);
	}

	if (!posts || posts.length === 0) {
		return <p>投稿がありません。</p>;
	}

	return posts.map(post => (
		<div key={post.id}>
			<h3><a href={post.link}>{post.title.rendered}</a></h3>
			<p>{post.content.rendered.replace(/<[^>]+>/g, '').substring(0, 55)}</p>
		</div>
	));
};

const Edit = ({ attributes, setAttributes }) => {
	const { numberOfPosts, selectedPostType } = attributes;
	const blockProps = useBlockProps();

	const excludedPostTypes = [
		'post',
		'page',
		'attachment',
		'nav_menu_item',
		'wp_block',
		'wp_template',
		'wp_template_part',
		'wp_navigation',
		'modal'
	];

	const postTypes = useSelect( (select) => {
		const allPostTypes = select('core').getPostTypes({ per_page: -1 });
		if (!allPostTypes) return [];
			return allPostTypes.filter(postType => !excludedPostTypes.includes(postType.slug));
	}, []);

	const posts = useSelect( (select) => {
		return select('core').getEntityRecords('postType', selectedPostType, { per_page: numberOfPosts });
	}, [ selectedPostType, numberOfPosts ]);

	const [loading, setLoadeing] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadeing(false);
		}, 500);
		return () => clearTimeout(timer)
	}, [postTypes, posts]);

	console.log("postTypes", postTypes);
	console.log("posts",posts);

	if (loading) {
		return <Spinner />;
	};

	return (
		<div {...blockProps}>
			{!postTypes || postTypes.length > 0 && (
				<InspectorControls>
					<SelectControl
						label = "投稿タイプの選択"
						value={ selectedPostType }
						options={ postTypes.map((type) => ({ label: type.name, value: type.slug })) }
						onChange={ (newType) => setAttributes({ selectedPostType: newType }) }
					/>
					<RangeControl
						label="表示する投稿の数"
						value={ numberOfPosts }
						onChange={ (newNumber) => setAttributes({ numberOfPosts: newNumber }) }
						min={1}
						max={5}
					/>
				</InspectorControls>
			)}
				<RenderPosts posts={posts} postTypes={postTypes} />
			</div>
    );
};

export default Edit;