const fetch = require('node-fetch');

let globalCursor = 'Unknown';

function padZero(num) {
    return (num < 10 ? '0' : '') + num;
}

function formatDate(value) {
    const date = new Date(value);
    const formattedDate = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;

    return formattedDate;
}

async function fetchingData(parameter, authorization, csrf, cookie, page = 1, cursor = 'Unknown') {
    let url = 'https://twitter.com/i/api/graphql/l0dLMlz_fHji3FT8AfrvxA/SearchTimeline?variables=%7B%22rawQuery%22%3A%22'+parameter+'%20-filter%3Alinks%20filter%3Areplies%22%2C%22count%22%3A20%2C%22querySource%22%3A%22typed_query%22%2C%22product%22%3A%22Latest%22%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D';

    if(cursor != "Unknown") {
        url = 'https://twitter.com/i/api/graphql/l0dLMlz_fHji3FT8AfrvxA/SearchTimeline?variables=%7B%22rawQuery%22%3A%22'+parameter+'%20-filter%3Alinks%20filter%3Areplies%22%2C%22count%22%3A20%2C%22cursor%22%3A%22'+cursor+'%22%2C%22querySource%22%3A%22typed_query%22%2C%22product%22%3A%22Latest%22%7D&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D';
    }
    
    const options = {
        method: 'GET',
        headers: {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,id;q=0.8",
            "authorization": authorization,
            "content-type": "application/json",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": csrf,
            "x-twitter-active-user": "yes",
            "x-twitter-auth-type": "OAuth2Session",
            "x-twitter-client-language": "en",
            "cookie": cookie,
            "Referer": "https://twitter.com/search?q="+parameter+"%20-filter%3Alinks%20filter%3Areplies&src=typed_query&f=live",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        let commentList = [];
        let commentTimeline = data.data.search_by_raw_query.search_timeline.timeline.instructions;
        let defaultNoImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";

        commentTimeline.forEach((rowTimeline, keyTimeline) => {
            if(typeof rowTimeline.entries != "undefined" && rowTimeline.entries.length > 0) {
                rowTimeline.entries.forEach((rowEntries, keyEntries) => {
                    let tweetId = rowEntries.entryId ?? "-";
                    if(tweetId.includes("tweet")) {
                        let dataResult = rowEntries.content.itemContent.tweet_results.result;
                        let dataUser = {};
                        let id = dataResult.rest_id ?? "-";

                        if(typeof dataResult.core != "undefined") {
                            let dataCore = dataResult.core.user_results.result;

                            dataUser = {
                                id: dataCore.id ?? "-",
                                rest_id: dataCore.rest_id ?? "-",
                                has_graduated_access: dataCore.has_graduated_access ?? false,
                                is_blue_verified: dataCore.is_blue_verified ?? false,
                                can_dm: dataCore.legacy.can_dm ?? false,
                                can_media_tag: dataCore.legacy.can_media_tag ?? false,
                                created_at: dataCore.legacy.created_at ? formatDate(dataCore.legacy.created_at) : "-",
                                description: dataCore.legacy.description ?? "-",
                                fast_followers_count: dataCore.legacy.fast_followers_count ?? 0,
                                favourites_count: dataCore.legacy.favourites_count ?? 0,
                                followers_count: dataCore.legacy.followers_count ?? 0,
                                friends_count: dataCore.legacy.friends_count ?? 0,
                                is_translator: dataCore.legacy.is_translator ?? false,
                                media_count: dataCore.legacy.media_count ?? 0,
                                name: dataCore.legacy.name ?? "No Name",
                                normal_followers_count: dataCore.legacy.normal_followers_count ?? 0,
                                profile_banner_url: dataCore.legacy.profile_banner_url_https ?? defaultNoImage,
                                profile_image_url: dataCore.legacy.profile_image_url_https ?? defaultNoImage,
                                screen_name: dataCore.legacy.screen_name ?? "No Name",
                                statuses_count: dataCore.legacy.statuses_count ?? 0,
                                verified: dataCore.legacy.verified ?? false,
                                want_retweets: dataCore.legacy.want_retweets ?? false
                            }

                            if(typeof dataResult != "undefined") {
                                let contentIsTranslatable = dataResult.is_translatable ?? false;
                                let contenViewtCount = 0;

                                if(typeof dataResult.views.count != "undefined") {
                                    contenViewtCount = dataResult.views.count;
                                }

                                if(typeof dataResult.legacy != "undefined") {
                                    let contentCreatedAt = dataResult.legacy.created_at ? formatDate(dataResult.legacy.created_at) : "-";
                                    let contentLang = dataResult.legacy.lang ?? "id";
                                    let contentFullText = dataResult.legacy.full_text ?? "";
                                    let contentBookmarkCount = dataResult.legacy.bookmark_count ?? 0;
                                    let contentFavoriteCount = dataResult.legacy.favorite_count ?? 0;
                                    let contentQuoteCount = dataResult.legacy.quote_count ?? 0;
                                    let contentReplyCount = dataResult.legacy.reply_count ?? 0;
                                    let contentRetweetCount = dataResult.legacy.retweet_count ?? 0;

                                    let hashtag = [];
                                    let media = [];

                                    if(typeof dataResult.legacy.entities != "undefined") {
                                        let whatEntities = dataResult.legacy.entities;
                                        if(typeof whatEntities.hashtags != "undefined" && whatEntities.hashtags.length > 0) {
                                            whatEntities.hashtags.forEach((rowHastag, keyHastag) => {
                                                hashtag.push(rowHastag.text ?? "-");
                                            });
                                        }

                                        if(typeof whatEntities.media != "undefined" && whatEntities.media.length > 0) {
                                            whatEntities.media.forEach((rowMedia, keyMedia) => {
                                                media.push(rowMedia.media_url_https ?? defaultNoImage);
                                            });
                                        }   
                                    }

                                    commentList.push({
                                        id: id,
                                        tweet_id: tweetId,
                                        user: dataUser,
                                        is_translatable: contentIsTranslatable,
                                        created_at: contentCreatedAt,
                                        lang: contentLang,
                                        full_text: contentFullText,
                                        bookmark_count: contentBookmarkCount,
                                        view_count: contenViewtCount,
                                        favorite_count: contentFavoriteCount,
                                        quote_count: contentQuoteCount,
                                        reply_count: contentReplyCount,
                                        retweet_count: contentRetweetCount,
                                        hashtag: hashtag,
                                        media: media
                                    });
                                }
                            }
                        }
                    }else if(page == 1 && tweetId.includes("cursor-bottom")) {
                        globalCursor = rowEntries.content.value ?? "Unknown"
                    }
                });
            }else if(page > 1 && typeof rowTimeline.entry_id_to_replace != "undefined" && rowTimeline.entry_id_to_replace.includes("cursor-bottom")) {
                globalCursor = rowTimeline.entry.content.value ?? "Unknown"
            }
        });

        return {
            status: true,
            list: commentList,
            error: null
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            status: false,
            list: [],
            error: error
        };
    }
}

async function getTwitter(req, res) {
    try {
        // let parameter = encodeURIComponent(req.body.keyword);
        // let authorization = req.body.authorization;
        // let csrf = req.body.csrf
        // let cookie = req.body.cookie;
        // let page = req.body.page > 0 ? req.body.page : 1;
        // let count = req.body.count > 0 ? req.body.count : 200;
        // let dataArray = [];
        // let errorArray = [];
        // let arrFinal = [];

        // if(page > 10) {
        //     res.status(500).json({ error: 'Maximum page is 10' });
        // }else if(count > 200) {
        //     res.status(500).json({ error: 'Maximum count is 200' });
        // }

        // globalCursor = 'Unknown';

        // for (let i = 1; i <= page; i++) {
        //     var data = await fetchingData(parameter, authorization, csrf, cookie, i, globalCursor);
        //     if(data.status == true) {
        //         dataArray.push(data.list);
        //     }else {
        //         errorArray.push(data.error);
        //     }
        // }

        // if(dataArray.length > 0) {
        //     dataArray.forEach((row, index) => {
        //         row.forEach((value, key) => {
        //             arrFinal.push(value);
        //         });
        //     });
        // }

        // let arrSlice = arrFinal.slice(0, count);
    
        // res.status(200).json({
        //     status: 1,
        //     status_code: 200,
        //     message: "Berhasil mendapatkan komentar twitter",
        //     info_error: null,
        //     data: arrSlice,
        //     error: errorArray
        // });

        res.json({
            status: 1,
            status_code: 200,
            message: "API twitter sudah tidak tersedia karena batas limit pemakaian.",
            info_error: null,
            data: null
        })
    } catch (error) {
        console.error('Error getting Twitter data:', error);
        res.status(500).json({
            status: 0,
            status_code: 422,
            message: "Gagal mendapatkan komentar twitter",
            info_error: error,
            data: null
        });
    }
}

module.exports = { getTwitter };