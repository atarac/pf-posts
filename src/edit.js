import { useSelect } from '@wordpress/data';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { RangeControl, SelectControl, Spinner } from '@wordpress/components';

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

		if (!posts || !postTypes) {
			return <Spinner />;
		};
		
    return (
        <>
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
					<div {...blockProps}>
						{
							posts && posts.map(post => (
								<div key={post.id}>
									<h3><a href={post.link}>{post.title.rendered}</a></h3>
									<p>{post.content.rendered.replace(/<[^>]+>/g, '').substring(0, 55)}</p>
								</div>
							))
						}
					</div>
        </>
    );
};

export default Edit;