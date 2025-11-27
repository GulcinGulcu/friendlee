import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import Loader from "./Loader";
import { Comment } from "./Comment";

type CommentsModal = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
  onCommentAdded: () => void;
};

export const CommentsModal = ({
  postId,
  onClose,
  visible,
  onCommentAdded,
}: CommentsModal) => {
  const [newComment, setNewComment] = useState("");

  const comments = useQuery(api.comments.getComments, { postId });
  const commentPost = useMutation(api.comments.commentPost);

  const handleCommentPost = async () => {
    if (!newComment.trim()) return;
    try {
      await commentPost({ postId, content: newComment });
      setNewComment("");
      onCommentAdded();
    } catch (error) {
      console.log("Error in commenting post", error);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="slide"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <Text style={{ width: 24 }} />
        </View>
        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Comment comment={item} />}
            contentContainerStyle={styles.commentsList}
          />
        )}
        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment"
            placeholderTextColor={COLORS.grey}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            onPress={handleCommentPost}
            disabled={!newComment.trim()}
          >
            <Text
              style={[
                styles.postButton,
                !newComment.trim() && styles.postButtonDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
