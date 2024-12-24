"use client"

import Link from "next/link"
import { useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, UseDisclosureProps, Input } from "@nextui-org/react"
import { getArticlePagingAPI } from '@/api/article'
import { Article } from "@/types/app/article"
import Empty from "../Empty"
import { useDebounceFn } from 'ahooks'

interface Props {
    disclosure: UseDisclosureProps & { onOpenChange: () => void }
}

export default ({ disclosure }: Props) => {
    const { isOpen, onClose, onOpenChange } = disclosure;

    const [data, setData] = useState<Paginate<Article[]>>()

    // 获取文章数据
    const getArticleList = async (key: string) => {
        if (key.trim().length === 0) {
            setData(undefined)
            return
        }

        const { data } = await getArticlePagingAPI({
            query: { key },
            pagination: { page: 1 }
        }) || { data: {} as Paginate<Article[]> }

        setData(data)
    }

    // 使用 useDebounceFn 创建防抖函数
    const { run: debouncedFetchArticles } = useDebounceFn(getArticleList, { wait: 300 })

    // 根据关键词搜索文章
    const onSearchArticle = (e: React.ChangeEvent<HTMLInputElement>) => {
        let key = e.target.value
        debouncedFetchArticles(key)
    }

    // const patchname = usePathname()
    // useEffect(() => {
    //     onClose()
    // }, [patchname])

    return (
        <>
            <div>
                <Modal
                    size="lg"
                    backdrop="opaque"
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    classNames={{
                        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">搜索文章</ModalHeader>

                                <ModalBody>
                                    <div className="mb-7">
                                        <Input type="text" placeholder="请输入文章关键词" onChange={onSearchArticle} />

                                        <div className="mt-4">
                                            {data?.result ? (
                                                data?.result?.map(item => (
                                                    <Link
                                                        key={item.id}
                                                        href={`/article/${item.id}`}
                                                        className="inline-block w-full py-2 px-4 mb-1 text-gray-700 dark:text-[#8c9ab1] hover:!text-primary hover:bg-[#f0f7ff] dark:hover:bg-[#25282d] hover:pl-8 rounded-md transition-all"
                                                        onClick={onClose}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ))
                                            ) : (
                                                data && <Empty info="暂无文章" />
                                            )}
                                        </div>
                                    </div>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}