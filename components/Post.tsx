import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "@/styles/feed.styles";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CommentsModal } from "./CommentsModal";
import { formatDistanceToNow } from "date-fns";

type PostProps = {
  post: {
    _id: Id<"posts">;
    _creationTime: number;
    caption?: string;
    userId: Id<"users">;
    imageUrl: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      id: Id<"users">;
      username: string;
      image: string;
    };
  };
};
const Post = ({ post }: PostProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [numberOfLikes, setNumberOfLikes] = useState(post.likes);
  const [numberOfComments, setNumberOfComments] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);

  const toggleLike = useMutation(api.posts.toggleLike);

  const handleToggleLike = async () => {
    try {
      const newIsLiked = await toggleLike({ postId: post._id });
      setIsLiked(newIsLiked);
      setNumberOfLikes((prev) => (newIsLiked ? prev + 1 : prev - 1));
    } catch (error) {
      console.log("Error toggling like", error);
    }
  };

  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Link href="/(tabs)/notifications">
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.author.image}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <Text style={styles.postUsername}>{post.author.username}</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" color={COLORS.white} size={20} />
        </TouchableOpacity>
      </View>
      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleToggleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={isLiked ? COLORS.primary : COLORS.white}
              size={28}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Ionicons
              name="chatbubble-outline"
              color={COLORS.white}
              size={26}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.postInfo}>
        {numberOfLikes > 0 && (
          <Text style={styles.likesText}>{numberOfLikes} likes</Text>
        )}
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}
        {numberOfComments > 0 && (
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Text style={styles.commentsText}>
              View all {numberOfComments} comments
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.timeAgo}>
          {formatDistanceToNow(post._creationTime, { addSuffix: true })}
        </Text>
      </View>

      <CommentsModal
        postId={post._id}
        onClose={() => setShowComments(false)}
        visible={showComments}
        onCommentAdded={() => setNumberOfComments((prev) => prev + 1)}
      />
    </View>
  );
};

export default Post;
