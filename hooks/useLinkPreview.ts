import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { AttachmentMeta } from '@/types/class.types';

interface Props {
	attachment: string[];
}

function useLinkPreview({ attachment }: Props) {
	const [preview, setPreview] = useState<AttachmentMeta[]>([]);
	const [isFetching, setIsFetching] = useState(false);

	function onDeletePreviewAttachment(index: number) {
		const updatedPreview = preview.filter((_, idx) => idx !== index);

		setPreview(updatedPreview);
	}

	const getPreviewAttachment = useCallback(async () => {
		setIsFetching(true);

		try {
			if (attachment.length !== 0) {
				const attachmentLink = attachment.map(async (value) => {
					return (await axios.get(`/api/link-preview?url=${value}`)).data;
				});

				const response = await Promise.all(attachmentLink);

				setPreview(response);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsFetching(false);
		}
	}, [attachment]);

	useEffect(() => {
		getPreviewAttachment();
	}, [getPreviewAttachment]);

	return {
		preview,
		isFetching,
		onDeletePreviewAttachment,
	};
}

export default useLinkPreview;
