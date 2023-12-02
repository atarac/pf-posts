import { useSelect } from '@wordpress/data';
import React, { useState, useEffect } from 'react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {RangeControl, SelectControl, ToggleControl, Spinner, PanelBody } from '@wordpress/components';

const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('ja-JP', {
		year:'numeric',
		month: 'long',
		day: 'numeric'
	});
};

const truncateText = (text, number) => {
	const cleanedText = text.replace(/<[^>]+>/g, '').trimStart().trimEnd();
	const truncatedText = cleanedText.length > number
		? cleanedText.substring(0, number + 1) + '...'
		: cleanedText;
	return truncatedText;
};
 
const RenderPosts = ({
	posts,
	postTypes,
	isShowDate,
	isShowModified,
	isShowContent,
	letterCounts,
 }) => {
	if (!postTypes || !postTypes.length) {
		return (
			<div className="custom-message">
				<p>表示できるカテゴリーがありません。</p>
			</div>
		);
	};

	if (!posts || !posts.length) {
		return (
			<div className="custom-message">
				<p>投稿がありません。</p>
			</div>
		);
	};

	return posts.map((post) => (
		<div key={ post.id } className="post-container">
			<h3 className="post-title"><a href={ post.link }>{ post.title.rendered }</a></h3>
			{ isShowDate && <p className="post-day">投稿日：{ formatDate(post.date) }</p> }
			{ isShowModified && <p className="modified-day">更新日：{ formatDate(post.modified) }</p> }
			{ isShowContent && <p className="post-content">{ truncateText(post.content.rendered, letterCounts) }</p> }
		</div>
	));
};

const Edit = ({ attributes, setAttributes }) => {
	const {
		numberOfPosts, 
		selectedPostType,
		isShowDate,
		isShowModified,
		isShowContent,
		letterCounts,
		postDesign
	} = attributes;

	const blockProps = useBlockProps({
		className: postDesign
	});

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

	const postTypes = useSelect((select) => {
		const allPostTypes = select('core').getPostTypes({ per_page: -1 });
		if (!allPostTypes) return [];
			return allPostTypes.filter((postType) => !excludedPostTypes.includes(postType.slug));
	}, []);

	const posts = useSelect((select) => {
		return select('core').getEntityRecords('postType', selectedPostType, { per_page: numberOfPosts });
	}, [selectedPostType, numberOfPosts]);

	const designOption = [
		{ label: 'デザイン1', value:'post-design1' },
		{ label: 'デザイン2', value:'post-design2' },
	]

	const [loading, setLoadeing] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadeing(false);
		}, 500);
		return () => clearTimeout(timer)
	}, [postTypes, posts]);

	if (loading) {
		return <Spinner />;
	};

	return (
		<div { ...blockProps }>
			{ !postTypes || postTypes.length > 0 && (
				<InspectorControls>
					<PanelBody title="表示内容の設定">
						<SelectControl
							label = "カテゴリー選択"
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
						<p>表示オプション</p>
						<ToggleControl
							label="投稿日の表示"
							checked={ isShowDate }
							onChange={ () => setAttributes({ isShowDate: !isShowDate }) }
						/>
						<ToggleControl
							label="更新日の表示"
							checked={ isShowModified }
							onChange={ () => setAttributes({ isShowModified: !isShowModified }) }
						/>
						<ToggleControl
							label="投稿内容の表示"
							checked={ isShowContent }
							onChange={ () => setAttributes({ isShowContent: !isShowContent }) }
						/>
						{ isShowContent &&
							<RangeControl
								label="投稿内容の表示文字数"
								value={ letterCounts }
								onChange={ (newLetterCounts) => setAttributes({ letterCounts: newLetterCounts }) }
								min={1}
								max={50}
						  />
						}
						<SelectControl
							label = "デザイン設定"
							value={ postDesign }
							options={ designOption }
							onChange={ (newDesign) => setAttributes({ postDesign: newDesign }) }
						/>
					</PanelBody>
				</InspectorControls>
			)}
				<RenderPosts
					posts={ posts }
					postTypes={ postTypes }
					isShowDate={ isShowDate }
					isShowModified={ isShowModified }
					isShowContent={ isShowContent }
					letterCounts={ letterCounts }
				/>
		</div>
  );
};

export default Edit;